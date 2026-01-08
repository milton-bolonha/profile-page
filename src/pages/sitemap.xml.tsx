import { GetServerSideProps } from "next";
import { getAllPostSlugs } from "@/lib/posts";
import citiesData from "../../content/cities.json";

function generateSiteMap(posts: any[], cities: any[]) {
    const baseUrl = "https://www.miltonbolonha.com.br"; // Ensure this matches your production URL
    const date = new Date().toISOString();

    // Core Pages
    const staticPages = [
        "",
        "/catalogo",
        "/contato",
        "/sobre",
        "/blog",
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/helpers/template.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Core Pages -->
  ${staticPages
            .map((url) => {
                return `
     <url>
       <loc>${baseUrl}${url}</loc>
       <lastmod>${date}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
   `;
            })
            .join("")}

  <!-- Catalog Items (Standard) -->
  ${posts
            .map(({ params }) => {
                return `
       <url>
           <loc>${baseUrl}/catalogo/${params.slug}</loc>
           <lastmod>${date}</lastmod>
           <changefreq>daily</changefreq>
           <priority>0.8</priority>
       </url>
     `;
            })
            .join("")}

  <!-- City Catalog Indexes -->
  ${cities
            .map((city) => {
                return `
       <url>
           <loc>${baseUrl}/cities/${city.id}</loc>
           <lastmod>${date}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
            })
            .join("")}

  <!-- City Catalog Items (Permutations) -->
  ${cities
            .map((city) => {
                return posts.map(({ params }) => {
                    return `
        <url>
            <loc>${baseUrl}/cities/${city.id}/${params.slug}</loc>
            <lastmod>${date}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
        </url>
      `;
                }).join("");
            })
            .join("")}
</urlset>
`;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    // 1. Get all posts
    const posts = getAllPostSlugs();

    // 2. Generate the XML sitemap with the posts data and cities data
    const sitemap = generateSiteMap(posts, citiesData);

    // 3. Set the correct headers
    res.setHeader("Content-Type", "text/xml");
    // res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate"); // Cache for 1 day

    // 4. Send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default SiteMap;
