// Initialize Supabase
// Initialize Supabase
const supabaseUrl = 'https://gsotmlcbrcjbgpgfzvvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzb3RtbGNicmNqYmdwZ2Z6dnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzczOTgsImV4cCI6MjA0MjI1MzM5OH0.cLbwIHop2B6WB_mYB-W6kMD2ZkZs007B_Brh2NZupQU';

let supabase;

async function initSupabase() {
  supabase = await supabase.createClient(supabaseUrl, supabaseKey);
  // Now you can use the supabase client
  console.log('Supabase client initialized');
}

initSupabase();

// Rest of your code...

// Query elements using querySelector (class selectors)
const answerInput = document.querySelector('.live_input');
const submitAnswer = document.querySelector('.live_btns button');
const answerList = document.querySelector('.answer_list');

let hasSubmitted = false; // Prevent multiple submissions

// Function to add an answer to the list
function addListItem(answerText) {
    const li = document.createElement('li');
    li.textContent = answerText;
    answerList.appendChild(li);
}

// Function to load answers from Supabase
async function loadAnswers() {
    const { data: answers, error } = await supabase
        .from('answers')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error loading answers:', error);
    } else {
        // Display the loaded answers
        answers.forEach(answer => addListItem(answer.answer));
    }
}

// Function to submit an answer
submitAnswer.addEventListener('click', async function () {
    if (hasSubmitted) {
        alert('You have already submitted an answer.');
        return;
    }

    const answerText = answerInput.value.trim();

    if (answerText) {
        // Insert the answer into Supabase
        const { data, error } = await supabase
            .from('answers')
            .insert([{ answer: answerText }]);

        if (error) {
            console.error('Error submitting answer:', error);
        } else {
            // Add the answer to the list
            addListItem(answerText);

            // Disable input and submit button after submitting
            answerInput.disabled = true;
            submitAnswer.disabled = true;
            hasSubmitted = true;
        }
    }
});

// Load answers when the page is loaded
window.addEventListener('load', loadAnswers);
