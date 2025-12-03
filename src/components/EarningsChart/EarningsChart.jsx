import React from "react";
import styles from "./EarningsChart.module.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Calls", value: 75 },
    { name: "Meetings", value: 50 },
    { name: "Deals Closed", value: 60 },
    { name: "Follow-ups Done", value: 25 },
    { name: "New Leads Generated", value: 70 },
    { name: "Client Retention Rate", value: 30 },
    { name: "Quarterly Review", value: 45 },
    { name: "Pipeline Updates", value: 55 },
    { name: "Email Campaigns", value: 65 },
    { name: "Customer Survey", value: 35 },
];

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltip}>
                <p>{`${label}`}</p>
                <strong>{payload[0].value}%</strong>
            </div>
        );
    }
    return null;
}

const CustomTick = ({ x, y, payload }) => {
    const fullText = payload.value;
    const displayText = fullText.length > 12 ? fullText.substring(0, 10) + "..." : fullText;

    return (
        <g transform={`translate(${x},${y})`}>
            <title>{fullText}</title> 
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
                {displayText}
            </text>
        </g>
    );
};


function EarningsChart() {
    return (
        <div className={styles.earningsContainer}>
            <h4 className={styles.chartTitle}>Earnings</h4>
            <div className={styles.chartResponsiveWrapper}>
                <div className={styles.chartInner}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={<CustomTick />} />
                            <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#007bff"
                                strokeWidth={3}
                                dot={{ r: 5 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default EarningsChart;
