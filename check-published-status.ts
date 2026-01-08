
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

function checkPosts() {
  if (!fs.existsSync(postsDirectory)) {
    console.log("Posts directory not found.");
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  console.log("--- Post Status Check ---");
  console.log(String("Filename").padEnd(40) + " | " + String("Published").padEnd(10) + " | " + "Public");
  console.log("-".repeat(70));

  let visibleCount = 0;
  let hiddenCount = 0;

  fileNames.forEach((fileName) => {
    if (!fileName.endsWith(".md")) return;
    
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const data = matterResult.data;

    const published = data.published;
    const publicField = data.public;

    let isVisible = published === true;
    
    // Logic as it WILL BE implemented:
    // Only published explicitly set to true will be visible.
    
    const publishedStr = published === undefined ? "undefined" : String(published);
    const publicStr = publicField === undefined ? "undefined" : String(publicField);

    console.log(
        fileName.padEnd(40) + " | " + 
        publishedStr.padEnd(10) + " | " + 
        publicStr
    );

    if (isVisible) {
        visibleCount++;
    } else {
        hiddenCount++;
    }
  });

  console.log("-".repeat(70));
  console.log(`Total Posts: ${visibleCount + hiddenCount}`);
  console.log(`Visible (published: true): ${visibleCount}`);
  console.log(`Hidden: ${hiddenCount}`);
}

checkPosts();
