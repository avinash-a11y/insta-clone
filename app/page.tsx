import { Metadata } from "next";
import Stories from "@/components/stories";
import Posts from "@/components/posts";

export const metadata: Metadata = {
  title: "Home | Instagram Clone",
  description: "View and share photos with friends",
};

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store"
  });
  const data = await response.json();
  
  return (
    <div className="bg-gray-50 dark:bg-dark-100 transition-colors duration-300 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 animate-fade-in space-y-6">
            {/* Stories */}
            <div className="insta-card overflow-hidden animate-slide-up">
              <Stories />
            </div>
            
            {/* Posts */}
            <Posts posts={data.posts} />
          </div>
          
          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Profile Card */}
            <div className="insta-card-hover p-6 animate-slide-up">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white dark:border-dark-300 shadow-md">
                  <img
                    src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Your Profile</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View and edit your profile</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-dark-200 p-3 rounded-lg">
                  <div className="font-bold text-gray-900 dark:text-gray-100">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-200 p-3 rounded-lg">
                  <div className="font-bold text-gray-900 dark:text-gray-100">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-200 p-3 rounded-lg">
                  <div className="font-bold text-gray-900 dark:text-gray-100">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
                </div>
              </div>
            </div>
            
            {/* Suggestions */}
            <div className="insta-card-hover p-6 animate-slide-up">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Suggested for you</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-300">
                        <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-200 dark:from-dark-200 dark:to-dark-400"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">user{i}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Suggested for you</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trending Topics */}
            <div className="insta-card-hover p-6 animate-slide-up">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["photography", "nature", "travel", "food", "art"].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-dark-200 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}