import { Queue } from "../../../lib/queueService"; 

interface QueueListItemProps {
  queue: Queue;
  onCheckIn: (key: string) => void;
  isProcessing: boolean;
}

export default function QueueListItem({ queue, onCheckIn, isProcessing }: QueueListItemProps) {
  const isEmergency = queue.type === "emergency";

  return (
    <li style={{ 
      borderBottom: "1px solid #ddd", 
      padding: "15px 10px", 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      backgroundColor: isEmergency ? "#fff5f5" : "transparent"
    }}>
      <div>
        <strong style={{ fontSize: "18px", color: isEmergency ? "red" : "white" }}>
          #{queue.queueNumber} - {queue.name}
        </strong> 
        <span style={{ marginLeft: "10px", fontStyle: "italic", color: "gray" }}>
          ({queue.status})
        </span>
        {isEmergency && <span style={{ marginLeft: "10px", color: "red", fontSize: "12px", fontWeight: "bold" }}>[DARURAT]</span>}
      </div>

      {queue.status === "registered" && (
        <button 
          
          onClick={() => onCheckIn(queue.key || "")}
          disabled={isProcessing}
          style={{ 
            padding: "8px 15px", 
            cursor: isProcessing ? "not-allowed" : "pointer", 
            backgroundColor: isProcessing ? "#ccc" : "green", 
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          Check In
        </button>
      )}
    </li>
  );
}