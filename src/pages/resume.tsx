import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import Experience from 'components/Experience';
import Education from 'components/Education';
import Research from 'components/Research';
import Skills from 'components/Skills';

const ResumePage: React.FC = () => (
  <Layout>
    <SEO title="Resume" />
    <Experience />
    <hr />
    <Research />
    <hr />
    <Education />
    <hr />
    <Skills />
  </Layout>
);

export default ResumePage;
