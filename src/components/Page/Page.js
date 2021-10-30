import React, { useRef, useEffect } from "react";
import Copyright from "../Sidebar/Copyright";
import { useSiteMetadata } from "../../hooks";
import styles from "./Page.module.scss";

type Props = {
  title?: string,
  children: React.Node,
};

const Page = ({ title, children }: Props) => {
  const pageRef = useRef();
  const { copyright } = useSiteMetadata();

  useEffect(() => {
    pageRef.current.scrollIntoView();
  });

  return (
    <div ref={pageRef} className={styles["page"]}>
      <div className={styles["page__inner"]}>
        {title && <h1 className={styles["page__title"]}>{title}</h1>}
        <div className={styles["page__body"]}>{children}</div>
      </div>
      <Copyright copyright={copyright} device={"mobile"} />
    </div>
  );
};

export default Page;
