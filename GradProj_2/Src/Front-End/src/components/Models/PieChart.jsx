import React, { useEffect, useRef } from "react";
import { FormatterPlugin, VChart } from "@visactor/vchart";

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
      outerRadius: 0.6, // Adjust radius
      valueField: "value", // Field for values
      categoryField: "type", // Field for categories
      title: {
        visible: true,
        text: title || "Pie Chart", // Use the title passed as a prop
      },
      label: {
        visible: true, // Show labels on the chart
        FormatterPlugin: (datum) => `${datum.type}: ${datum.value}`, // Label format
      },
      legends: {
        visible: true, // Show legends
        orient: "left",
      },
      tooltip: {
        mark: {
          content: [
            {
              key: (datum) => datum.type,
              value: (datum) => `${datum.value}`, // Tooltip shows the value
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
