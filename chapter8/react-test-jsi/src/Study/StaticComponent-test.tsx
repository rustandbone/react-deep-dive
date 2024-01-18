import { render, screen } from "@testing-library/react";
import StaticComponent from "./StaticComponent";

// beforeEach: 각 테스트(it)을 수행하기 전에 실행하는 함수
//StaticComponent 렌더링

beforeEach(() => {
  render(<StaticComponent />);
});

// describe: 비슷한 속성을 가진 테스트를 하나의 그룹으로 묶는 역할으로 꼭 필요한 메서드는 아니다.
// it: test와 완전히 동일하며, test의 축약어(alias).
// testId: 리액트 테스팅 라이브러리 예약어

describe("링크 확인", () => {
  it("링크가 3개 존재한다.", () => {
    const ul = screen.getByTestId("ul");
    expect(ul.children.length).toBe(3);
  });

  it("링크 목록의 스타일이 square다.", () => {
    const ul = screen.getByTestId("ul");
    expect(ul).toHaveStyle("list-style-type: square;");
  });
});

describe("리액트 링크 테스트", () => {
  it("리액트 링크가 존재한다.", () => {
    const reactLink = screen.getByText("리액트");
    expect(reactLink).toBeVisible();
  });

  it("리액트 링크가 올바른 주소로 존재한다.", () => {
    const reactLink = screen.getByText("리액트");

    expect(reactLink.tagName).toEqual("A");
    expect(reactLink).toHaveAttribute("href", "https://reactjs.org");
  });
});

describe("네이버 링크 테스트", () => {
  it("네이버 링크가 존재한다.", () => {
    const naverLink = screen.getByText("네이버");
    expect(naverLink).toBeVisible();
  });

  it("네이버 링크가 올바른 주소로 존재한다.", () => {
    const naverLink = screen.getByText("네이버");

    expect(naverLink.tagName).toEqual("A");
    expect(naverLink).toHaveAttribute("href", "https://www.naver.com");
  });
});

describe("블로그 링크 테스트", () => {
  it("블로그 링크가 존재한다.", () => {
    const blogLink = screen.getByText("블로그");
    expect(blogLink).toBeVisible();
  });

  it("블로그 링크가 올바른 주소로 존재한다.", () => {
    const blogLink = screen.getByText("블로그");

    expect(blogLink.tagName).toEqual("A");
    expect(blogLink).toHaveAttribute("href", "https://yceffort.kr");
  });

  it("블로그는 같은 창에서 열려야 한다..", () => {
    const blogLink = screen.getByText("블로그");
    expect(blogLink).not.toHaveAttribute("target");
  });
});
