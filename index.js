// this script handles fetching and displaying all blog posts,
// showing post details when clicked, and adding new posts via submission

/** Initializes the application when DOM fully loads */
function main() {
    displayPosts(); // shows all posts
    addNewPostListener(); // set up form submission handler
    console.log("App initialized");
}

// wait for DOM content to load before running main()
document.addEventListener('DOMContentLoaded', main);

/** fetches all posts from the API and displays them */
function displayPosts() {
    const postList = document.getElementById('post-list');
    fetch('http://localhost:3000/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(posts => {
            console.log('Successfully fetched posts:', posts);
            postList.innerHTML = '';
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postList.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postList.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
        });
}

/** creates an element for a single post
 * @param {Object} post - the post object from API
 * @returns {HTMLElement} - the created post element
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-item';
    postDiv.dataset.id = post.id;

    postDiv.innerHTML = `
        <h3>${post.title}</h3>
        ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
        <button class="view-btn" data-id="${post.id}">View Details</button>
    `;

    // attach event listener to the "View Details" button
    const viewBtn = postDiv.querySelector('.view-btn');
    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent event bubbling
        handlePostClick(post.id);
    });

    return postDiv;
}

/** Handles click on a post to show its details
 * @param {number} postId - ID of the post to display
 */
function handlePostClick(postId) {
    const postDetail = document.getElementById('post-detail');
    postDetail.innerHTML = '<p>Loading...</p>'; // optional loading indicator

    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(post => {
            console.log('Showing post details:', post);
            postDetail.innerHTML = `
                <h3>${post.title}</h3>
                <p class="author">By: ${post.author}</p>
                <p class="content">${post.content}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
            postDetail.innerHTML = '<p>Failed to load post details.</p>';
        });
}

/** Sets up event listener for the new post form */
function addNewPostListener() {
    const form = document.getElementById('new-post-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const newPost = {
            title: form.title.value,
            content: form.content.value,
            author: form.author.value,
            // image: form.image.value // Uncomment if you add an image input
        };

        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(post => {
            console.log('Successfully created new post:', post);
            const postList = document.getElementById('post-list');
            const postElement = createPostElement(post);
            postList.appendChild(postElement);
            form.reset();
        })
        .catch(error => {
            console.error('Error creating new post:', error);
            alert('Failed to create post. Please try again.');
        });
    });
}

// ======================
// HELPER FUNCTIONS (FOR FUTURE USE)
// ======================

/** Displays an error message in the UI
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/** Placeholder for future post update functionality
 * @param {number} postId - ID of post to update
 * @param {Object} updatedData - New data for the post
 */
function updatePost(postId, updatedData) {
    console.log(`Would update post ${postId} with:`, updatedData);
}