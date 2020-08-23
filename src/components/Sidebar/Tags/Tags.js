// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import styles from './Tags.module.scss';

type Props = {
    tags: {
    fieldValue: string,
    totalCount: number
  }[]
};

const Tags = ({ tags }: Props) => (
  <nav className={styles['tag']}>
      {tags.map((item, idx) => (
          <Link 
            to={`/tag/${kebabCase(item.fieldValue)}/`}
            className={styles['tag__button']}
            activeClassName={styles['tag__item-link--active']}
          >
            {item.fieldValue}({item.totalCount})
          </Link>
      ))}
  </nav>
);

export default Tags;
