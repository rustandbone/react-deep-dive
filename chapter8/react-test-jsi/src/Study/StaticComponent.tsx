import { memo } from "react";

interface AnchorTagComponentProps {
  name: string;
  href: string;
  targetBlank?: boolean;
}

const AnchorTagComponent = memo(function AnchorTagComponent({
  name,
  href,
  targetBlank,
}: AnchorTagComponentProps) {
  //* 별도의 상태가 존재하지 않아 항상 같은 결과를 반환한다.
  return (
    <a
      href={href}
      target={targetBlank ? "_blank" : undefined}
      rel="noopener noreferrer"
    >
      {name}
    </a>
  );
});

export default function StaticComponent() {
  return (
    <>
      <h1>Static Component</h1>
      <div>유용한 링크</div>

      {/* testId: testId 데이터셋 선언시 getByTestId, findByTestId 등 선택 가능 */}
      <ul data-testid="ul" style={{ listStyleType: "square" }}>
        <li>
          <AnchorTagComponent
            targetBlank
            name="리액트"
            href="https://reactjs.org"
          />
        </li>
        <li>
          <AnchorTagComponent
            targetBlank
            name="네이버"
            href="https://www.naver.com"
          />
        </li>
        <li>
          <AnchorTagComponent name="블로그" href="https://yceffort.kr" />
        </li>
      </ul>
    </>
  );
}
