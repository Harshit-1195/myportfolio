-- Create a function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql;
