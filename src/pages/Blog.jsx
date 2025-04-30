import React from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Modern Architecture Trends in 2025',
    date: 'April 28, 2025',
    excerpt: 'Discover how sustainability and smart technology are reshaping modern construction projects.',
    image: 'https://source.unsplash.com/800x600/?construction,architecture',
  },
  {
    id: 2,
    title: 'How We Delivered a Smart Building Ahead of Schedule',
    date: 'March 10, 2025',
    excerpt: 'A behind-the-scenes look at how we used innovation and teamwork to complete a smart commercial building before the deadline.',
    image: 'https://source.unsplash.com/800x600/?building,engineering',
  },
  {
    id: 3,
    title: 'Top 5 Materials Revolutionizing Construction',
    date: 'February 22, 2025',
    excerpt: 'From self-healing concrete to 3D-printed panels, check out the top materials we’re using this year.',
    image: 'https://source.unsplash.com/800x600/?materials,construction',
  },
];

const Blog = () => {
  return (
    <section className="py-16 bg-gray-100" id="blog">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Latest from Our Blog</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <p className="text-gray-600">{post.excerpt}</p>
                <button className="mt-4 text-blue-600 hover:underline">Read More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
