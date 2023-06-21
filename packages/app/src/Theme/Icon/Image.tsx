import { Theme } from "~/Theme";

export function Image(props: Theme.Icon) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.99935 7.33366C6.73573 7.33366 7.33268 6.73671 7.33268 6.00033C7.33268 5.26395 6.73573 4.66699 5.99935 4.66699C5.26297 4.66699 4.66602 5.26395 4.66602 6.00033C4.66602 6.73671 5.26297 7.33366 5.99935 7.33366Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 9.99947L11.9427 7.94214C11.6926 7.69218 11.3536 7.55176 11 7.55176C10.6464 7.55176 10.3074 7.69218 10.0573 7.94214L4 13.9995"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
