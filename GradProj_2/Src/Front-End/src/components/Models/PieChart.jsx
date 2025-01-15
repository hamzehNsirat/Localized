import React, { useEffect, useRef } from "react";
import { VChart } from "@visactor/vchart";

const PieChart = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Define the spec for the pie chart
    const spec = {
      type: "pie",
      data: [
        {
          id: "pieData",
          values: data, // Use the data passed as a prop
        },
      ],
      outerRadius: 0.6,
      valueField: "value",
      categoryField: "type",
      colorField: "color",
      encode: {
        color: "color", // Map color from data
      },
      title: {
        visible: true,
        text: title || "Pie Chart",
      },
      label: {
        visible: true,
        FormatterPlugin: (datum) => `${datum.type}: ${datum.value}%`, // Format label
      },
      legends: {
        visible: true,
        orient: "left",
      },
      tooltip: {
        mark: {
          content: [
            {
              key: (datum) => datum.type,
              value: (datum) => `${datum.value}%`,
            },
          ],
        },
      },
    };

    // Initialize and render the chart
    const vchart = new VChart(spec, { dom: chartRef.current });
    vchart.renderSync();

    // Cleanup on component unmount
    return () => {
      vchart.release();
    };
  }, [data, title]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "400px",
        boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
      }}
    />
  );
};

export default PieChart;
