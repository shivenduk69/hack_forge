
        // Data structure to hold questions and answers
        let questions = JSON.parse(localStorage.getItem('universityQA')) || [];

        // DOM elements
        const questionsContainer = document.getElementById('questionsContainer');
        const noQuestions = document.getElementById('noQuestions');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const searchBtn = document.getElementById('searchBtn');

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            renderQuestions();
            
            // Event listeners
            document.getElementById('submitQuestion').addEventListener('click', addQuestion);
            document.getElementById('submitAnswer').addEventListener('click', addAnswer);
            searchBtn.addEventListener('click', renderQuestions);
            sortSelect.addEventListener('change', renderQuestions);
            
            // Enable search on Enter key
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    renderQuestions();
                }
            });
        });

        // Add a new question
        function addQuestion() {
            const title = document.getElementById('questionTitle').value;
            const body = document.getElementById('questionBody').value;
            const author = document.getElementById('questionAuthor').value || 'Anonymous';
            
            if (title && body) {
                const newQuestion = {
                    id: Date.now(),
                    title: title,
                    body: body,
                    author: author,
                    timestamp: new Date().toISOString(),
                    votes: 0,
                    userVote: 0, // 0 = no vote, 1 = upvote, -1 = downvote
                    answers: []
                };
                
                questions.unshift(newQuestion);
                saveQuestions();
                renderQuestions();
                
                // Reset form and close modal
                document.getElementById('questionForm').reset();
                bootstrap.Modal.getInstance(document.getElementById('askQuestionModal')).hide();
            }
        }

        // Add an answer to a question
        function addAnswer() {
            const body = document.getElementById('answerBody').value;
            const author = document.getElementById('answerAuthor').value || 'Anonymous';
            const questionId = parseInt(document.getElementById('currentQuestionId').value);
            
            if (body) {
                const question = questions.find(q => q.id === questionId);
                if (question) {
                    const newAnswer = {
                        id: Date.now(),
                        body: body,
                        author: author,
                        timestamp: new Date().toISOString(),
                        votes: 0,
                        userVote: 0
                    };
                    
                    question.answers.unshift(newAnswer);
                    saveQuestions();
                    renderQuestions();
                    
                    // Reset form and close modal
                    document.getElementById('answerForm').reset();
                    bootstrap.Modal.getInstance(document.getElementById('answerModal')).hide();
                }
            }
        }

        // Save questions to localStorage
        function saveQuestions() {
            localStorage.setItem('universityQA', JSON.stringify(questions));
        }

        // Render questions based on search and sort
        function renderQuestions() {
            const searchTerm = searchInput.value.toLowerCase();
            const sortBy = sortSelect.value;
            
            // Filter questions
            let filteredQuestions = questions.filter(question => 
                question.title.toLowerCase().includes(searchTerm) || 
                question.body.toLowerCase().includes(searchTerm) ||
                question.answers.some(answer => answer.body.toLowerCase().includes(searchTerm))
            );
            
            // Sort questions
            if (sortBy === 'newest') {
                filteredQuestions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            } else if (sortBy === 'oldest') {
                filteredQuestions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            } else if (sortBy === 'mostVoted') {
                filteredQuestions.sort((a, b) => b.votes - a.votes);
            }
            
            // Display questions or "no questions" message
            if (filteredQuestions.length === 0) {
                noQuestions.style.display = 'block';
                questionsContainer.innerHTML = '';
            } else {
                noQuestions.style.display = 'none';
                questionsContainer.innerHTML = '';
                
                filteredQuestions.forEach(question => {
                    const questionCard = createQuestionCard(question);
                    questionsContainer.appendChild(questionCard);
                });
            }
        }

        // Create HTML for a question card
        function createQuestionCard(question) {
            const card = document.createElement('div');
            card.className = 'card question-card';
            
            // Question header
            const header = document.createElement('div');
            header.className = 'card-header question-header d-flex justify-content-between align-items-center';
            header.innerHTML = `
                <h5 class="mb-0">${question.title}</h5>
                <span class="user-badge"><i class="fas fa-user me-1"></i>${question.author}</span>
            `;
            
            // Question body
            const body = document.createElement('div');
            body.className = 'card-body';
            body.innerHTML = `
                <p class="card-text">${question.body}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="timestamp me-3">
                            <i class="far fa-clock me-1"></i>${formatDate(question.timestamp)}
                        </span>
                        <span class="text-muted">
                            <i class="far fa-comment me-1"></i>${question.answers.length} answers
                        </span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-outline-primary answer-btn" data-question-id="${question.id}">
                            <i class="fas fa-reply me-1"></i>Answer
                        </button>
                    </div>
                </div>
            `;
            
            // Voting controls
            const footer = document.createElement('div');
            footer.className = 'card-footer bg-white d-flex justify-content-start align-items-center';
            footer.innerHTML = `
                <div class="me-3">
                    <i class="fas fa-arrow-up vote-btn upvote ${question.userVote === 1 ? 'upvoted' : ''}" 
                       data-question-id="${question.id}" data-vote-type="up"></i>
                    <span class="mx-2">${question.votes}</span>
                    <i class="fas fa-arrow-down vote-btn downvote ${question.userVote === -1 ? 'downvoted' : ''}" 
                       data-question-id="${question.id}" data-vote-type="down"></i>
                </div>
            `;
            
            card.appendChild(header);
            card.appendChild(body);
            card.appendChild(footer);
            
            // Add answers if any
            if (question.answers.length > 0) {
                const answersContainer = document.createElement('div');
                answersContainer.className = 'card-footer bg-light';
                
                question.answers.forEach(answer => {
                    const answerCard = createAnswerCard(question.id, answer);
                    answersContainer.appendChild(answerCard);
                });
                
                card.appendChild(answersContainer);
            }
            
            return card;
        }

        // Create HTML for an answer card
        function createAnswerCard(questionId, answer) {
            const card = document.createElement('div');
            card.className = 'card answer-card mb-2';
            
            const body = document.createElement('div');
            body.className = 'card-body p-3';
            body.innerHTML = `
                <p class="card-text">${answer.body}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="user-badge me-2"><i class="fas fa-user me-1"></i>${answer.author}</span>
                        <span class="timestamp">
                            <i class="far fa-clock me-1"></i>${formatDate(answer.timestamp)}
                        </span>
                    </div>
                    <div>
                        <i class="fas fa-arrow-up vote-btn upvote ${answer.userVote === 1 ? 'upvoted' : ''}" 
                           data-question-id="${questionId}" data-answer-id="${answer.id}" data-vote-type="up"></i>
                        <span class="mx-2">${answer.votes}</span>
                        <i class="fas fa-arrow-down vote-btn downvote ${answer.userVote === -1 ? 'downvoted' : ''}" 
                           data-question-id="${questionId}" data-answer-id="${answer.id}" data-vote-type="down"></i>
                    </div>
                </div>
            `;
            
            card.appendChild(body);
            return card;
        }

        // Format date to relative time (e.g., "2 hours ago")
        function formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);
            
            let interval = Math.floor(seconds / 31536000);
            if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
            
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
            
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
            
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
            
            interval = Math.floor(seconds / 60);
            if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
            
            return Math.floor(seconds) + " second" + (seconds === 1 ? "" : "s") + " ago";
        }

        // Event delegation for dynamic elements
        document.addEventListener('click', function(e) {
            // Answer button click
            if (e.target.classList.contains('answer-btn') || e.target.closest('.answer-btn')) {
                const button = e.target.classList.contains('answer-btn') ? e.target : e.target.closest('.answer-btn');
                const questionId = parseInt(button.getAttribute('data-question-id'));
                document.getElementById('currentQuestionId').value = questionId;
                const modal = new bootstrap.Modal(document.getElementById('answerModal'));
                modal.show();
            }
            
            // Voting on questions
            if (e.target.classList.contains('vote-btn') && e.target.hasAttribute('data-question-id') && !e.target.hasAttribute('data-answer-id')) {
                const questionId = parseInt(e.target.getAttribute('data-question-id'));
                const voteType = e.target.getAttribute('data-vote-type');
                handleVote(questionId, null, voteType);
            }
            
            // Voting on answers
            if (e.target.classList.contains('vote-btn') && e.target.hasAttribute('data-answer-id')) {
                const questionId = parseInt(e.target.getAttribute('data-question-id'));
                const answerId = parseInt(e.target.getAttribute('data-answer-id'));
                const voteType = e.target.getAttribute('data-vote-type');
                handleVote(questionId, answerId, voteType);
            }
        });

        // Handle voting
        function handleVote(questionId, answerId, voteType) {
            const question = questions.find(q => q.id === questionId);
            if (!question) return;
            
            let target, userVoteProp;
            
            if (answerId) {
                // Voting on an answer
                const answer = question.answers.find(a => a.id === answerId);
                if (!answer) return;
                
                target = answer;
                userVoteProp = 'userVote';
            } else {
                // Voting on a question
                target = question;
                userVoteProp = 'userVote';
            }
            
            const newVoteValue = voteType === 'up' ? 1 : -1;
            
            // If user is clicking the same vote button again, remove their vote
            if (target[userVoteProp] === newVoteValue) {
                target.votes -= newVoteValue;
                target[userVoteProp] = 0;
            } 
            // If user is changing their vote
            else if (target[userVoteProp] !== 0) {
                target.votes += (newVoteValue * 2); // Remove previous vote and add new one
                target[userVoteProp] = newVoteValue;
            } 
            // If user is voting for the first time
            else {
                target.votes += newVoteValue;
                target[userVoteProp] = newVoteValue;
            }
            
            saveQuestions();
            renderQuestions();
        }