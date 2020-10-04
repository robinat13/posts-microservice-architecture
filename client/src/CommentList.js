import React from "react";

export default ({ comments = [] }) => {
  const renderedComments = comments.map((comment) => {
    return (
      <li key={comment.id}>
        {comment.status === "approved"
          ? comment.content
          : comment.status === "pending"
          ? "Comment awaiting moderation"
          : "This comment was rejected"}
      </li>
    );
  });

  return <ul>{renderedComments}</ul>;
};
