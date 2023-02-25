import dynamic from "next/dynamic";

const GraphCanvas = dynamic(
  async () => {
    return (await import("reagraph")).GraphCanvas;
  },
  {
    ssr: false,
    loading: () => <p>Loading</p>,
  }
);

export const NetworkGraph: React.FC<
  React.ComponentProps<typeof GraphCanvas>
> = (props) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <GraphCanvas {...props} />
    </div>
  );
};
