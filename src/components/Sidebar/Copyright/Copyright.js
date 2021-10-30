// @flow strict
import React from "react";
import styles from "./Copyright.module.scss";

type Props = {
  copyright: string,
  device: string,
};

const Copyright = ({ copyright, device }: Props) => (
  <div className={device !== "mobile" ? styles["copyright"] : styles["copyright-m"]}>{copyright}</div>
);

export default Copyright;
