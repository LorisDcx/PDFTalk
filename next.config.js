/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  async redirects() {
    return [
      {
        source: '/comparatif/quizlet-alternative',
        destination: '/compare/quizlet-alternative',
        permanent: true,
      },
      {
        source: '/use-cases/etudiants-medecine',
        destination: '/use-cases/medical-students',
        permanent: true,
      },
      {
        source: '/use-cases/etudier-langues',
        destination: '/use-cases/language-learning',
        permanent: true,
      },
      {
        source: '/use-cases/droit',
        destination: '/use-cases/law-students',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
