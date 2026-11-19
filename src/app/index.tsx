import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const exercises = [
  { question: '7 + 5', answer: '12' },
  { question: '9 + 4', answer: '13' },
  { question: '15 - 7', answer: '8' },
  { question: '8 + 6', answer: '14' },
  { question: '17 - 9', answer: '8' },
];

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];

export default function HomeScreen() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [finished, setFinished] = useState(false);

  const exercise = exercises[exerciseIndex];

  function handleKey(key: string) {
    if (finished) return;

    if (key === '⌫') {
      setAnswer(answer.slice(0, -1));
      setFeedback('');
      return;
    }

    if (key === 'OK') {
      if (answer === exercise.answer) {
        setFeedback('Corect! 🎉');

        setTimeout(() => {
          if (exerciseIndex === exercises.length - 1) {
            setFinished(true);
            setFeedback('');
          } else {
            setExerciseIndex(exerciseIndex + 1);
            setAnswer('');
            setFeedback('');
          }
        }, 600);
      } else {
        setFeedback('Mai încearcă.');
      }

      return;
    }

    setAnswer(answer + key);
    setFeedback('');
  }

  if (finished) {
    return (
      <View style={styles.finishedContainer}>
        <Text style={styles.finishedTitle}>Sesiune terminată! 🎉</Text>
        <Text style={styles.finishedText}>Ai rezolvat 5 exerciții.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aritmetică Mentală</Text>

      <Text style={styles.progress}>
        Exercițiul {exerciseIndex + 1} din {exercises.length}
      </Text>

      <Text style={styles.question}>{exercise.question} = ?</Text>

      <View style={styles.answerBox}>
        <Text style={styles.answer}>{answer}</Text>
      </View>

      <Text style={styles.feedback}>{feedback}</Text>

      <View style={styles.keypad}>
        {keys.map((key) => (
          <Pressable
            key={key}
            onPress={() => handleKey(key)}
            style={[styles.key, key === 'OK' && styles.okKey]}
          >
            <Text style={[styles.keyText, key === 'OK' && styles.okText]}>
              {key}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  progress: {
    fontSize: 18,
    marginBottom: 25,
  },
  question: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 25,
  },
  answerBox: {
    width: 170,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D9E2F0',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answer: {
    fontSize: 38,
    fontWeight: '700',
  },
  feedback: {
    height: 40,
    marginTop: 12,
    fontSize: 22,
    fontWeight: '700',
  },
  keypad: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  key: {
    width: '30%',
    height: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D9E2F0',
  },
  okKey: {
    backgroundColor: '#2477F3',
  },
  keyText: {
    fontSize: 27,
    fontWeight: '700',
  },
  okText: {
    color: '#FFFFFF',
  },
  finishedContainer: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  finishedTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  finishedText: {
    fontSize: 22,
    textAlign: 'center',
  },
});