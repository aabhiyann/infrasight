interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  rounded?: boolean;
}

const Skeleton = ({
  height = 16,
  width = "100%",
  rounded = true,
}: SkeletonProps) => {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        borderRadius: rounded ? 8 : 0,
      }}
    />
  );
};

export default Skeleton;
