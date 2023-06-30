import { Theme } from "~/Theme";

export function Coin(props: Theme.Icon) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.9004 24.8473C6.3021 24.8473 0.953125 19.4983 0.953125 12.9C0.953125 6.3017 6.3021 0.952728 12.9004 0.952728C19.4987 0.952728 24.8477 6.3017 24.8477 12.9C24.8477 19.4983 19.4987 24.8473 12.9004 24.8473ZM12.9004 1.95273C6.85438 1.95273 1.95312 6.85399 1.95312 12.9C1.95312 18.946 6.85438 23.8473 12.9004 23.8473C18.9464 23.8473 23.8477 18.946 23.8477 12.9C23.8477 6.85399 18.9464 1.95273 12.9004 1.95273ZM13.0152 5.2835C8.74731 5.2835 5.28344 8.76876 5.28344 13.0731C5.28344 17.3774 8.74731 20.8627 13.0152 20.8627C17.283 20.8627 20.7469 17.3774 20.7469 13.0731C20.7469 8.76876 17.283 5.2835 13.0152 5.2835ZM4.6141 13.0731C4.6141 8.40362 8.37314 4.61416 13.0152 4.61416C17.6572 4.61416 21.4163 8.40362 21.4163 13.0731C21.4163 17.7426 17.6572 21.5321 13.0152 21.5321C8.37314 21.5321 4.6141 17.7426 4.6141 13.0731ZM11.8628 10.1454C11.678 10.1454 11.5282 10.2952 11.5282 10.4801C11.5282 10.6649 11.678 10.8147 11.8628 10.8147H12.8822V15.8963C12.8822 16.0811 13.032 16.2309 13.2169 16.2309C13.4017 16.2309 13.5515 16.0811 13.5515 15.8963V10.4801C13.5515 10.2952 13.4017 10.1454 13.2169 10.1454H11.8628Z"
        fill="#3F3F46"
      />
    </svg>
  );
}
