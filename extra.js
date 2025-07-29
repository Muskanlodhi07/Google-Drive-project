<!DOCTYPE html>
<html lang="en" class="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Insights - Financial Advice</title>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <script>
      // Dark Mode Toggle
      tailwind.config = { 
        darkMode: 'class',
      };
    </script>
  </head>
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
    <!-- Header -->
    <header class="bg-red-300 dark:bg-gray-800 px-6 py-4 flex justify-between items-center">
      <div class="text-3xl font-bold">Pookie's Pocket</div>
      <div class="flex gap-4 items-center">
        <button
          onclick="document.documentElement.classList.toggle('dark')"
          class=" dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded-md dark:border-gray-600"
        >
        <i data-feather="clock" class="w-5 h-5"></i>
        </button>
        <button class="border border-gray-700 text-black dark:text-white px-3 py-1 rounded-md dark:border-gray-400">
          Login
        </button>
      </div>
    </header>

    <!-- Hero -->
    <section class="bg-white dark:bg-gray-800 py-10 text-center">
    <div class="bg-white w-full h-64 bg-white flex items-center justify-center dark:bg-gray-800">
      <img src="\images\Beep Beep - Sheeps.png" alt="Hero Image" class="max-w-full max-h-full object-contain" />
    </div>
    <h1 class="text-4xl font-bold">  Your Files. Your Control.</h1>
    </section>

      <!-- Category Filter -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <a href="/user/home" ><button class="px-4 py-1 border bg-blue-900 text-white">Home</button></a>
        <a href="/user/recent"><button class="px-4 py-1 border bg-white dark:bg-gray-700">Recent</button></a>
        <a href="/user/bin"><button class="px-4 py-1 border bg-white dark:bg-gray-700">Bin</button></a>
        <button class="px-4 py-1 border bg-white dark:bg-gray-700">About</button>
        <button class="px-4 py-1 border bg-white dark:bg-gray-700">Shared with me</button>
      </div>

      <!-- upload box -->
          <section
            class="bg-blue-100 border flex flex-wrap m-6 py-10 px-6 max-w-6xl mx-auto justify-center dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md text-center"
          >
        <form action="/user/file-upload"
        method="post"
        enctype="multipart/form-data"
        >
        <h2 class="text-lg font-semibold mb-4 ">Upload file</h2>
          <input type="file" id="fileInput" name="file" class="mb-4 text-sm text-gray-700 dark:text-white" />
          <button onclick="upload(event)"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            upload
          </button>

        </form>  
    </section>

      <!-- Files section -->
      <div id="uploadCards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 dark:text-white p-4 rounded-md">
          <% files.forEach(file => { %>
            <div class="file-card">
              <div class="p-2 p-4 h-20 rounded-lg bg-white dark:bg-gray-800 cursor-pointer break-words w-300 shadow-lg">
                <%= file.filename %>
              </div>
              <a href="<%= file.fileUrl %>" download="file.jpg"  target="_blank"   class="inline-block px-4 py-2 mt-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">Download</a>
              <form action="/user/delete-file/<%= file._id %>" method="POST" style="display:inline;">
                <button type="submit" onclick="return confirm('Delete this file?')" 
                  class="px-4 py-2 mt-3 bg-red-600 text-white font-medium rounded-md shadow hover:bg-red-700"
                >🗑️ Delete</button>
              </form>
            </div>
          <% }) %>
      </div>

    <!-- Save Tax Section -->
  <section class="bg-gray-100 py-12 px-4 dark:text-gray-700">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
      <img src="https://cdn-icons-png.flaticon.com/512/2922/2922688.png" alt="selfie" class="w-40 mb-4 md:mb-0" />
      <div class="text-center md:text-left">
        <h2 class="text-2xl font-bold mb-2">Save tax in 2 minutes</h2>
        <p class="mb-4">Saving for 80c is like taking a selfie literally. Try it for yourself</p>
        <button class="bg-[#173A59] text-white px-6 py-2 rounded">GET STARTED</button>
      </div>
    </div>
  </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
        <div>
          <h4 class="font-semibold mb-2">Subscribe to Insights</h4>
          <p class="text-sm text-gray-300 mb-2">Get best of insights delivered to your inbox</p>
          <button class="bg-white text-black px-4 py-1 rounded-md">Subscribe</button>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Have a Question?</h4>
          <p class="text-sm text-gray-300 mb-2">Get advice from experts, for free, in 48 hours</p>
          <button class="bg-white text-black px-4 py-1 rounded-md">Post your Thought</button>
        </div>
      </div>
      <div class="text-center mt-6 text-gray-400 text-sm">
        &copy; 2025 Insights. All rights reserved.
      </div>
    </footer>
  </body>

  <script>feather.replace()</script>
  <script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></script>

<script>
  async function upload(event) {
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('file', file);

  const res = await fetch('/upload', {
  method: 'POST',
  credentials: 'include', // ✅ this sends the cookie!
  body: formData
  });
}
</script>



</html>










<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home</title>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
      };
    </script>
  </head>
  <body class="bg-pink-200 dark:bg-gray-900 text-gray-900 dark:text-white relative">
    <!-- Top Navbar -->
    <header
      class="flex items-center justify-between px-4 py-3 border-b border-pink-250 dark:border-gray-700 relative z-20 bg-pink-300 dark:bg-gray-900"
    >
      <div class="flex items-center gap-3 w-full">
        <!-- Sidebar Toggle Button (Mobile Only) -->
        <button id="menuBtn" onclick="toggleSidebar()" class="text-2xl lg:hidden">
          ☰
        </button>

        <!-- Search Bar -->
        <input
          type="text" 
          placeholder="Search in Drive"
          class="flex-grow min-w-screen rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none text-sm"
        />
      </div>

      <!-- Login Button Toggle button-->
      
       <button onclick="document.documentElement.classList.toggle('dark')">
            <i data-feather="clock" class="w-5 h-5 cursor-pointer m-3"></i>
        </button>
      <a href="/user/register">
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center me-2 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">login</button>
      </a>
    </header>

    <!-- Main Layout -->
    <div class="relative flex flex-col lg:flex-row">
      <!-- Overlay Sidebar -->
      <aside
        id="sidebar"
        class="fixed top-0 left-0 z-30 min-h-screen w-64 bg-pink-200 dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700 transform -translate-x-full transition-transform duration-300 lg:relative lg:translate-x-0 lg:block"
      >
        <h2 class="text-xl font-bold mb-5">📁 Drive</h2>
      <nav class="flex-1 space-y-2 text-sm font-medium">
      <a href="/user/home" class="flex items-center gap-2 p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400">
        <i data-feather="home" class="w-4 h-4"></i> Home
      </a>
      <a href="#" class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <i data-feather="folder" class="w-4 h-4"></i> My Drive
      </a>
      <a href="#" class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <i data-feather="monitor" class="w-4 h-4"></i> Computers
      </a>
      <a href="#" class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <i data-feather="users" class="w-4 h-4"></i> Shared with me
      </a>
      <a href="/user/recent" class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <i data-feather="clock" class="w-4 h-4"></i> Recent
      </a>
      <a href="#" class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <i data-feather="star" class="w-4 h-4"></i> Starred
      </a>
      <a href="/user/bin" class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <i data-feather="trash-2" class="w-4 h-4"></i> Bin
      </a>
    </nav>
      </aside>
      <!-- Main Content -->
    <div class=" w-full">

        <main
          id="mainContent"
          class="flex flex-col justify-center items-center h-[66.6667vh] bg-pink-200 dark:bg-gray-900 relative z-0"
        >
          <h1 class=" text-2xl text-red-300 dark:text-white shadow-lg font-bold mb-10 text-center">
            Your Files. Your Control.
          </h1>

          <div
            class="bg-white dark:bg-gray-800 p-6 m-6 rounded-lg shadow-lg w-full max-w-md text-center"
          >

        <form action="/user/file-upload"
        method="post"
        enctype="multipart/form-data"
        >
        <h2 class="text-lg font-semibold mb-4">Upload file</h2>
          <input type="file" id="fileInput" name="file" class="mb-4 text-sm text-gray-700 dark:text-white" />
          <button 
          onclick="upload()"
          class=" bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            upload
          </button>
        </form>  
        </div>
        </main>
          <div class="files flex flex-col gap-3 m-6 w-80" >
          <% files.forEach(file => { %>
            <div class="file-card">
              <div class="p-2 p-4 rounded-lg bg-white dark:bg-gray-800 cursor-pointer break-words w-300 shadow-lg">
                <%= file.filename %>
              </div>
              <a href="<%= file.fileUrl %>" download="file.jpg"  target="_blank"   class="inline-block px-4 py-2 mt-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">Download</a>
              <form action="/user/delete-file/<%= file._id %>" method="POST" style="display:inline;">
                <button type="submit" onclick="return confirm('Delete this file?')" 
                  class="px-4 py-2 mt-3 bg-red-600 text-white font-medium rounded-md shadow hover:bg-red-700"
                >🗑️ Delete</button>
              </form>
            </div>
          <% }) %>
        </div>
      </div>
    </div>

    <!-- JavaScript -->
    <script>
      const sidebar = document.getElementById("sidebar");
      const mainContent = document.getElementById("mainContent");
      const menuBtn = document.getElementById("menuBtn");

      function toggleSidebar() {
        sidebar.classList.toggle("-translate-x-full");
      }

      // Click outside to close (only for small screens)
      document.addEventListener("click", function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnMenuBtn = menuBtn.contains(event.target);
        const isSidebarVisible = !sidebar.classList.contains("-translate-x-full");

        // If clicked outside sidebar AND it's visible AND not on button
        if (!isClickInsideSidebar && !isClickOnMenuBtn && isSidebarVisible && window.innerWidth < 1024) {
          sidebar.classList.add("-translate-x-full");
        }
      });
    </script>
    <script>feather.replace()</script>

<!-- Toggle Dark Mode (Optional button for testing) -->
<script>
  // Toggle with browser setting or manually
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
</script>
<script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></script>
<script>
  async function upload() {
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('file', file);

  const res = await fetch('/upload', {
  method: 'POST',
  credentials: 'include', // ✅ this sends the cookie!
  body: formData
  });

    const data = await res.json();
    alert("Uploaded URL: " + data.url);
  }
</script>

  </body>
</html>
