import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Timeline from 'components/ui/Timeline';
import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';
import FormatHtml from 'components/utils/FormatHtml';

import { SectionTitle } from 'helpers/definitions';

interface Experience {
  node: {
    id: string;
    html: React.ReactNode;
    frontmatter: {
      lab: string;
      position: string;
      startDate: string;
      endDate: string;
    };
  };
}

const Research: React.FC = () => {
  const { markdownRemark, allMarkdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "research section" } }) {
        frontmatter {
          title
          subtitle
        }
      }
      allMarkdownRemark(
        filter: { frontmatter: { category: { eq: "research" } } }
        sort: { order: DESC, fields: fileAbsolutePath }
      ) {
        edges {
          node {
            id
            html
            frontmatter {
              lab
              position
              startDate
              endDate
            }
          }
        }
      }
    }
  `);

  const sectionTitle: SectionTitle = markdownRemark.frontmatter;
  const research: research[] = allMarkdownRemark.edges;

  return (
    <Container section>
      <TitleSection title={sectionTitle.title} subtitle={sectionTitle.subtitle} />

      {research.map((item) => {
        const {
          id,
          html,
          frontmatter: { lab, position, startDate, endDate }
        } = item.node;

        return (
          <Timeline
            key={id}
            title={lab}
            subtitle={position}
            content={<FormatHtml content={html} />}
            startDate={startDate}
            endDate={endDate}
          />
        );
      })}
    </Container>
  );
};

export default Research;
