// Initialize Supabase with your credentials
const supabaseUrl = 'https://gsotmlcbrcjbgpgfzvvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzb3RtbGNicmNqYmdwZ2Z6dnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzczOTgsImV4cCI6MjA0MjI1MzM5OH0.cLbwIHop2B6WB_mYB-W6kMD2ZkZs007B_Brh2NZupQU';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Query elements
const answerInput = document.querySelector('#answerInput');
const submitAnswer = document.querySelector('#submitAnswer');
const answerList = document.getElementById('answersList');
const clearDataButton = document.getElementById('clearData');

let hasSubmitted = false;

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
submitAnswer.addEventListener('click', async function() {
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

// Clear data button to remove all answers from Supabase
clearDataButton.addEventListener('click', async function() {
  const { error } = await supabase
    .from('answers')
    .delete()
    .neq('id', 0); // Clears all rows

  if (error) {
    console.error('Error clearing data:', error);
  } else {
    // Clear the answers list in the UI
    answerList.innerHTML = '';
    // Enable input and submit button again
    answerInput.disabled = false;
    submitAnswer.disabled = false;
    answerInput.value = '';
    hasSubmitted = false;

    alert('All data has been cleared!');
  }
});
