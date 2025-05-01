document.getElementById("submitBtn").addEventListener("click", function() {
    const feedbackInput = document.getElementById("feedbackInput");
    const feedbackText = feedbackInput.value.trim();

    // Validate if input is empty
    if (feedbackText === "") {
        alert("Please enter your feedback before submitting.");
        return;
    }

    // Create a new feedback item container
    const feedbackItem = document.createElement("div");
    feedbackItem.className = "feedback-item";

    // Add the feedback text
    const feedbackTextDiv = document.createElement("div");
    feedbackTextDiv.className = "feedback-text";
    feedbackTextDiv.textContent = feedbackText;

    // Create action buttons (like and dislike)
    const feedbackActions = document.createElement("div");
    feedbackActions.className = "feedback-actions";

    // Like button with initial count
    const likeBtn = document.createElement("button");
    likeBtn.innerHTML = "👍 Like <span>0</span>";
    likeBtn.addEventListener("click", function() {
        let likeCount = parseInt(likeBtn.querySelector("span").textContent);
        likeCount++;
        likeBtn.querySelector("span").textContent = likeCount;
    });

    // Dislike button with initial count
    const dislikeBtn = document.createElement("button");
    dislikeBtn.innerHTML = "👎 Dislike <span>0</span>";
    dislikeBtn.addEventListener("click", function() {
        let dislikeCount = parseInt(dislikeBtn.querySelector("span").textContent);
        dislikeCount++;
        dislikeBtn.querySelector("span").textContent = dislikeCount;
    });

    // Append like and dislike buttons to actions div
    feedbackActions.appendChild(likeBtn);
    feedbackActions.appendChild(dislikeBtn);

    // Append the feedback text and actions to the feedback item div
    feedbackItem.appendChild(feedbackTextDiv);
    feedbackItem.appendChild(feedbackActions);

    // Append the new feedback item to the feedback section
    document.getElementById("feedbackList").prepend(feedbackItem);

    // Clear the input field after submission
    feedbackInput.value = "";
});