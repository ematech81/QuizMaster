
  const handleSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    console.log(
      'Selected Option:',
      selectedOption,
      'Correct Answer:',
      currentQuestion.answer
    );

    incrementAttemptedQuestions();

    let newEarnings = earnings;
    let newRewards = rewards;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      newEarnings += 0.1;
      setPopupMessage('Correct! You earned $0.1');
      if (correctAnswers + 1 === 10) {
        newRewards += 0.5;
        setPopupMessage('Bonus! 10 correct answers! You earned $0.5');
      } else if (correctAnswers + 1 === 20) {
        newRewards += 1.0;
        setPopupMessage('Amazing! 20 correct answers! You earned $1');
      }
    } else {
      setWrongAnswers((prev) => prev + 1);
      newEarnings -= 0.01;
      setPopupMessage('Wrong! You lost $0.01');
    }

    const newTotalEarnings =
      (parseFloat(newEarnings.toFixed(2)) || 0) +
      (parseFloat(newRewards.toFixed(2)) || 0);
    console.log(
      'Calculated Earnings:',
      newEarnings,
      'Rewards:',
      newRewards,
      'Total Earnings:',
      newTotalEarnings
    );

    setEarnings(parseFloat(newEarnings.toFixed(2)) || 0);
    setRewards(parseFloat(newRewards.toFixed(2)) || 0);
    setTotalEarnings(parseFloat(newTotalEarnings.toFixed(2)) || 0);

    setIsSubmitted(true);
    setPopupVisible(true);
    clearInterval(intervalIdRef.current);

    setTimeout(() => {
      setPopupVisible(false);
      setIsSubmitted(false);
      moveToNextQuestion();
    }, 2000);