import { fireEvent, render, screen } from "@testing-library/react";
import { rest, setupServer } from "msw";
import { FetchComponent } from "./FetchComponent";

const MOCK_TODO_RESPONSE = {
  userId: 1,
  id: 1,
  title: "delectus aut autem",
  completed: false,
};

// MSW 활용한 fetch 응답 모킹
const server = setupServer(
  rest.get("/todos/:id", (req: any, res: any, ctx: any) => {
    const todoId = res.params.id;

    if (Number(todoId)) {
      return res(ctx.json({ ...MOCK_TODO_RESPONSE, id: Number(todoId) }));
    } else {
      return res(ctx.status(400));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // setupServer의 기본 설정으로 되돌리는 역할. 테스트 후 변경되는 설정들을 초기화
afterAll(() => server.close());

beforeEach(() => {
  render(<FetchComponent />);
});

describe("FetchComponent 테스트", () => {
  it("데이터를 불러오기 전에는 기본 문구가 뜬다.", async () => {
    const nowLoading = screen.getByText(/불러온 데이터가 없습니다./);
    expect(nowLoading).toBeInTheDocument();
  });

  it("버튼을 클릭하면 데이터를 불러온다.", async () => {
    const button = screen.getByRole("button", { name: /1번/ });
    fireEvent.click(button);

    // get 메서드는 원하는 값을 동기 방식으로 찾기 때문에 find 메서드 사용
    const data = await screen.findByText(MOCK_TODO_RESPONSE.title);
    expect(data).toBeInTheDocument();
  });

  it("버튼을 클릭하고 서버 요청에서 에러가 발생하면 에러 문구를 노출한다.", async () => {
    // setupServer에서 정상적인 응답만 모킹하였기 때문에 server.use를 이용해 기존 setupServer을 덮어 씌운다.
    server.use(
      rest.get("todos/:id", (req: any, res: any, ctx: any) => {
        return res(ctx.state(503));
      })
    );

    const button = screen.getByRole("button", { name: /1번/ });
    fireEvent.click(button);

    const error = await screen.findByText(/에러가 발생했습니다/);
    expect(error).toBeInTheDocument();

    // 테스트 종료 후 afterEach(() => server.resetHandlers()); 문 실행하여 setupServer 다시 초기값 설정
  });
});
