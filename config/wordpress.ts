export const wordpressConfig = {
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin-al-asr.centers.pk',
  graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/graphql',
  restEndpoint: process.env.NEXT_PUBLIC_REST_API_ENDPOINT || '/wp-json',
  apiTimeout: 10000, // 10 seconds
  cacheTime: 5 * 60 * 1000, // 5 minutes
};

export const graphqlQueries = {
  posts: `
    query GetPosts($first: Int, $after: String, $category: Int) {
      posts(first: $first, after: $after, where: {categoryId: $category}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          databaseId
          title
          excerpt
          content
          date
          modified
          slug
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          featuredVideoSimple
          videoUrl
          postVideo
          testVideo
        }
      }
    }
  `,
  
  post: `
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        content
        excerpt
        date
        modified
        slug
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
          nodes {
            id
            name
            slug
          }
        }
        author {
          node {
            id
            name
            avatar {
              url
            }
          }
        }
        featuredVideoSimple
        videoUrl
        postVideo
        testVideo
      }
    }
  `,
  
  categories: `
    query GetCategories {
      categories {
        nodes {
          id
          name
          slug
          count
          description
        }
      }
    }
  `,
  
  menu: `
    query GetMenu($location: MenuLocationEnum!) {
      menu(location: $location) {
        menuItems {
          nodes {
            id
            label
            url
            target
            parentId
            cssClasses
          }
        }
      }
    }
  `,
};