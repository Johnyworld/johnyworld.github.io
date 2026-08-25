'use client';

import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

interface Props extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

interface Heading {
  id: number;
  level: number;
  title: string;
  slug: string;
  parent?: number;
}

export const MarkdownTOC = ({ content, ...props }: Props) => {
  const headings = getHeadings(content);
  const headingTree = generateHeadingTree(headings);
  return (
    <div
      {...props}
      className={classNames('markdown-toc', 'text-xs text-gray print:hidden', props.className)}
    >
      <HeadingTree headings={headingTree} headingId={undefined} />
    </div>
  );
};

const HeadingTree = ({
  headings,
  headingId,
}: {
  headings: Heading[];
  headingId: number | undefined;
}) => {
  const children = headings.filter(item => item.parent === headingId);
  if (children.length === 0) {
    return null;
  }
  return (
    <ul className="in-[ul]:ml-5 relative z-10">
      {children.map(item => (
        <li key={item.id} className="mt-px">
          <Link
            className="block underline w-full px-1 pt-0.5 pb-1 -mx-1 rounded-xs clickable"
            href={`#${item.slug}`}
          >
            {item.title}
          </Link>
          <HeadingTree headings={headings} headingId={item.id} />
        </li>
      ))}
    </ul>
  );
};

const getHeadings = (content: string): Heading[] =>
  content
    .split('\n')
    .filter(line => line.match(/^#{1,3}\s/))
    .map((line, i) => {
      const match = line.match(/(#{1,3})\s(.*)/);
      const [, level, title] = match!;
      return {
        id: i,
        level: level.length,
        title,
        slug: title.replace(/\s/g, '-'),
      };
    });

const generateHeadingTree = (headings: Heading[]): Heading[] => {
  return headings.map((heading, i) => {
    let parent: number | undefined = undefined;
    for (let j = i; j >= 0; j--) {
      if (headings[j].level < heading.level) {
        parent = headings[j].id;
        break;
      }
    }
    return { ...heading, parent };
  });
};
