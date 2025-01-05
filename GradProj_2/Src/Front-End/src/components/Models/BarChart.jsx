import React, { useEffect, useRef } from "react";
import { VChart } from "@visactor/vchart";

const BarChart = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Mapping colors directly in the specification
    const colorMapping = {
      Requested: "#F9A828", // Orange
      Confirmed: "#252525", // Black
      Completed: "#2C8C99", // Teal
    };

    // Transform data to include the color field
    const transformedData = data.map((item) => ({
      ...item,
      color: colorMapping[item.type] || "#CCCCCC", // Default to gray if type is not in the mapping
    }));

    const spec = {
      type: "bar",
      data: [
        {
          id: "barData",
          values: transformedData, // Use transformed data with colors
        },
      ],
      xField: "type", // Field for x-axis (requested, confirmed, completed)
      yField: "value", // Field for y-axis (count values)
      colorField: "color", // Field that maps to bar colors

      title: {
        visible: true,
        text: title || "Quotation Overview",
      },
      legends: {
        visible: true,
        orient: "bottom",
      },
      tooltip: {
        mark: {
          content: [
            {
              key: (datum) => datum["type"],
              value: (datum) => `${datum["value"]} Quotations`,
            },
          ],
        },
      },
    };

    // Initialize the chart
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
        height: "300px",
        boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
      }}
    />
  );
};

export default BarChart;
