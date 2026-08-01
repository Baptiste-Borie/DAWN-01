interface PostItProps {
  quote?: string;
  author?: string;
}

export default function PostIt({
  quote = "The final glorious evolution.",
  author = "Viktor",
}: PostItProps) {
  return (
    <div className="postIt-wrap">
      <span className="postIt-tape" />
      <div className="postIt-note">
        <h2 className="postIt-title">Note</h2>
        <blockquote className="postIt-quote">{quote}</blockquote>
        <cite className="postIt-author">— {author}</cite>
      </div>
    </div>
  );
}
