import styles from "./ChatBubble.module.scss";

function ChatBubble({ message, sender, timestamp }) {
  const isAI = sender === "ai";

  return (
    <div
      className={`${styles.bubble} ${
        isAI ? styles.bubbleAI : styles.bubbleUser
      }`}
    >
      <div className={styles.bubbleHeader}>
        <span className={styles.sender}>
          {isAI ? (
            <>
              <span className={styles.aiAvatar}>AI</span> PM Interview Coach
            </>
          ) : (
            "You"
          )}
        </span>
        {timestamp && (
          <span className={styles.timestamp}>
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
      <div className={styles.bubbleContent}>{message}</div>
    </div>
  );
}

export default ChatBubble;
