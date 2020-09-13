// @flow strict
import React from "react";
import { Link } from "gatsby";
import kebabCase from "lodash/kebabCase";
import Author from "./Author";
import Comments from "./Comments";
import Content from "./Content";
import Meta from "./Meta";
import Tags from "./Tags";
import styles from "./Post.module.scss";
import type { Node } from "../../types";

type Props = {
  post: Node,
};

const Post = ({ post }: Props) => {
  const { html } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;
  const tableOfContents = (
    <ul className={styles["post__toc-list"]}>
      <li>
        <label>{title}</label>
      </li>
      {post &&
        post.headings.map((header) => (
          <li
            className={styles["post__toc-list-item"]}
            key={header.value}
            title={header.value}
            style={{ paddingLeft: `${header.depth - 1}rem` }}
          >
            <Link
              to={`${slug}#${kebabCase(header.value)}`}
              className={styles["post__toc-list-item-link"]}
            >
              {header.value}
            </Link>
          </li>
        ))}
    </ul>
  );

  return (
    <div className={styles["post"]}>
      <Link className={styles["post__home-button"]} to="/">
        All Articles
      </Link>

      <div className={styles["post__toc"]}>{tableOfContents}</div>

      <div className={styles["post__content"]}>
        <Content body={html} title={title} />
      </div>

      <div className={styles["post__footer"]}>
        <Meta date={date} />
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <Author />
      </div>

      <div className={styles["post__comments"]}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
