interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const OverviewIcon = ({
  size = 20,
  className,
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const ForecastIcon = ({
  size = 20,
  className,
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12L7 8L13 14L21 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 6H21V10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AnomalyIcon = ({
  size = 20,
  className,
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RecommendationIcon = ({
  size = 20,
  className,
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.663 17H4.337C3.603 17 3 16.397 3 15.663V8.337C3 7.603 3.603 7 4.337 7H9.663C10.397 7 11 7.603 11 8.337V15.663C11 16.397 10.397 17 9.663 17Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.337 7H11.663C10.929 7 10.326 7.603 10.326 8.337V15.663C10.326 16.397 10.929 17 11.663 17H16.337C17.071 17 17.674 16.397 17.674 15.663V8.337C17.674 7.603 17.071 7 16.337 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M21 3V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LogsIcon = ({
  size = 20,
  className,
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13H8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17H8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 9H8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LogoutIcon = ({
  size = 20,
  className,
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17L21 12L16 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfraSightLogo = ({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
    <path
      d="M8 12C8 10.3431 9.34315 9 11 9H21C22.6569 9 24 10.3431 24 12V20C24 21.6569 22.6569 23 21 23H11C9.34315 23 8 21.6569 8 20V12Z"
      fill="white"
      opacity="0.2"
    />
    <path
      d="M10 14C10 13.4477 10.4477 13 11 13H13C13.5523 13 14 13.4477 14 14V18C14 18.5523 13.5523 19 13 19H11C10.4477 19 10 18.5523 10 18V14Z"
      fill="white"
    />
    <path
      d="M16 14C16 13.4477 16.4477 13 17 13H19C19.5523 13 20 13.4477 20 14V18C20 18.5523 19.5523 19 19 19H17C16.4477 19 16 18.5523 16 18V14Z"
      fill="white"
    />
    <path
      d="M12 10H20C20.5523 10 21 10.4477 21 11C21 11.5523 20.5523 12 20 12H12C11.4477 12 11 11.5523 11 11C11 10.4477 11.4477 10 12 10Z"
      fill="white"
      opacity="0.8"
    />
  </svg>
);
