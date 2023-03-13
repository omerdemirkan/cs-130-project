/**
 * @module web/client
 */
import dynamic from "next/dynamic";
import { Spin } from "antd";

const GraphCanvas = dynamic(
  async () => {
    return (await import("reagraph")).GraphCanvas;
  },
  {
    ssr: false,
    loading: () => 
        <div id="graph-loading" className="mx-96 my-96">
          <Spin size="large" />
        </div>
  }
);

/**
 * A component representing a graph visualization.
 * @category Components
 */
export const NetworkGraph: React.FC<
  React.ComponentProps<typeof GraphCanvas>
> = (props) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <GraphCanvas {...props} />
    </div>
  );
};
