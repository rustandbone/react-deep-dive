import { fireEvent, render } from "@testing-library/react";
import { InputComponent } from "./DynamicComponent";
import userEvent from "@testing-library/user-event";

describe("InputComponent 테스트", () => {
  // setup 함수: 내부 컴포넌트 렌더링
  const setup = () => {
    const screen = render(<InputComponent />);
    const input = screen.getByLabelText("input") as HTMLInputElement;
    const button = screen.getByText(/제출하기/i) as HTMLButtonElement;
    return {
      input,
      button,
      ...screen,
    };
  };

  it("input의 초깃값은 빈 문자열이다.", () => {
    const { input } = setup();
    expect(input.value).toEqual("");
  });

  it("input의 최대 길이가 20자로 설정돼 있다.", () => {
    const { input } = setup();
    expect(input).toHaveAttribute("maxLength", "20");
  });

  // userEven.type: 사용자가 타이핑하는 것을 흉내 내는 메서드로 특별히 사용자의 이벤트를 흉내 내야 할 때만 userEvent를 사용한다.
  it("영문과 숫자만 입력된다.", () => {
    const { input } = setup();
    const inputValue = "안녕하세요123";
    userEvent.type(input, inputValue);
    expect(input.value).toEqual("123");
  });

  it("아이디를 입력하지 않으면 버튼이 활성화되지 않는다.", () => {
    const { button } = setup();
    expect(button).toBeDisabled();
  });

  it("아이디를 입력하면 버튼이 활성화된다.", () => {
    const { button, input } = setup();

    const inputValue = "helloworld";
    userEvent.type(input, inputValue);

    expect(input.value).toEqual(inputValue);
    expect(button).toBeEnabled();
  });

  // jest.spyOn(window, 'alert').mockImplementation()
  // jest.spyOn: 어떠한 특정 메서드를 오염시키지 않고 실행이 됐는지, 또 어떤 인수로 실행됐는지 등 실행과 관련된 정보를 얻는다.
  // mockImplementation: 해당 메서드에 대한 모킹(mocking) 구현을 도와준다.

  it("버튼을 클릭하면 alert가 해당 아이디로 표시된다.", () => {
    const alertMock = jest
      .spyOn(window, "alert")
      .mockImplementation((_: string) => undefined);

    const { button, input } = setup();
    const inputValue = "helloworld";

    userEvent.type(input, inputValue);
    fireEvent.click(button);

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith(inputValue);
  });
});
