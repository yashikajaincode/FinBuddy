import * as tf from '@tensorflow/tfjs';

class ChatbotGRU {
  constructor(vocabSize = 1000, embeddingDim = 32, gruUnits = 64) {
    this.vocabSize = vocabSize;
    this.embeddingDim = embeddingDim;
    this.gruUnits = gruUnits;
    this.model = this.buildModel();
    this.tokenizer = null;
    this.maxSequenceLength = 50;
  }

  buildModel() {
    const model = tf.sequential();
    
    // Add embedding layer
    model.add(tf.layers.embedding({
      inputDim: this.vocabSize,
      outputDim: this.embeddingDim,
      inputLength: this.maxSequenceLength
    }));

    // Add GRU layer
    model.add(tf.layers.gru({
      units: this.gruUnits,
      returnSequences: false
    }));

    // Add dense output layer
    model.add(tf.layers.dense({
      units: this.vocabSize,
      activation: 'softmax'
    }));

    // Compile the model
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  preprocessText(text) {
    // Tokenize and pad sequence
    const sequence = text.toLowerCase().split(' ');
    const paddedSequence = this.padSequence(sequence);
    return paddedSequence;
  }

  padSequence(sequence) {
    if (sequence.length > this.maxSequenceLength) {
      return sequence.slice(0, this.maxSequenceLength);
    }
    return [...sequence, ...Array(this.maxSequenceLength - sequence.length).fill('pad')];
  }

  async train(trainingData) {
    try {
      if (!Array.isArray(trainingData) || trainingData.length === 0) {
        throw new Error('Invalid training data format');
      }

      // Validate training data format
      trainingData.forEach((data, index) => {
        if (!data.input || !data.output) {
          throw new Error(`Invalid training data at index ${index}: missing input or output`);
        }
      });

      // Create vocabulary from training data
      const vocabulary = new Set();
      trainingData.forEach(data => {
        data.input.toLowerCase().split(' ').forEach(word => vocabulary.add(word));
      });
      this.vocabulary = Array.from(vocabulary);

      // Convert training data to tensors
      const sequences = trainingData.map(data => {
        const wordIndices = this.preprocessText(data.input).map(word => 
          this.vocabulary.indexOf(word) !== -1 ? this.vocabulary.indexOf(word) : 0
        );
        return wordIndices;
      });

      const labels = trainingData.map(data => {
        const label = new Array(this.vocabSize).fill(0);
        const outputIndex = Math.min(this.vocabSize - 1, this.getOutputIndex(data.output));
        label[outputIndex] = 1;
        return label;
      });

      const xs = tf.tensor2d(sequences, [sequences.length, this.maxSequenceLength]);
      const ys = tf.tensor2d(labels, [labels.length, this.vocabSize]);

      // Train the model with error handling
      const result = await this.model.fit(xs, ys, {
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Training epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
          }
        }
      });

      // Cleanup tensors
      xs.dispose();
      ys.dispose();

      return result;
    } catch (error) {
      console.error('Error during model training:', error);
      throw error;
    }
  }

  getOutputIndex(output) {
    // Map output categories to indices
    const categories = [
      'investment_response',
      'portfolio_response',
      'market_response',
      'planning_response',
      'risk_response'
    ];
    return categories.indexOf(output) !== -1 ? categories.indexOf(output) : 0;
  }

  async predict(input) {
    try {
      if (!this.vocabulary) {
        throw new Error('Model not trained yet. Please train the model first.');
      }

      const sequence = this.preprocessText(input).map(word => 
        this.vocabulary.indexOf(word.toLowerCase()) !== -1 ? this.vocabulary.indexOf(word.toLowerCase()) : 0
      );
      
      const inputTensor = tf.tensor2d([sequence], [1, this.maxSequenceLength]);
      
      const prediction = await this.model.predict(inputTensor);
      const result = await prediction.array();
      
      inputTensor.dispose();
      prediction.dispose();
      
      return result[0];
    } catch (error) {
      console.error('Error during prediction:', error);
      throw error;
    }
  }

  // Method to save conversation context
  updateContext(conversation) {
    this.conversationContext = conversation;
  }

  // Method to get enhanced response based on context
  async getEnhancedResponse(input, financialData) {
    const prediction = await this.predict(input);
    
    // Combine prediction with financial context
    return this.generateContextualResponse(prediction, financialData);
  }

  generateContextualResponse(prediction, financialData) {
    // Generate response based on prediction and financial context
    const confidenceScore = Math.max(...prediction);
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    
    // Map prediction index to response categories
    const responseCategories = [
      'investment_advice',
      'portfolio_analysis',
      'market_insights',
      'financial_planning',
      'risk_management'
    ];

    const category = responseCategories[maxIndex % responseCategories.length];
    
    // Generate contextual response based on category and financial data
    let response = '';
    switch(category) {
      case 'investment_advice':
        response = `Based on your profile with ${financialData?.monthlyIncome ? '₹' + financialData.monthlyIncome + ' monthly income' : 'current income'}, I recommend focusing on ${financialData?.riskTolerance || 'balanced'} risk investments.`;
        break;
      case 'portfolio_analysis':
        response = `Looking at your portfolio${financialData?.investments ? ' worth ₹' + financialData.investments.total : ''}, consider rebalancing to optimize returns.`;
        break;
      case 'market_insights':
        response = 'Based on current market conditions, consider diversifying your investments across multiple asset classes.';
        break;
      case 'financial_planning':
        response = `Let's create a financial plan aligned with your ${financialData?.goals?.length ? 'existing goals' : 'future objectives'}.`;
        break;
      case 'risk_management':
        response = `Given your ${financialData?.riskTolerance || 'risk profile'}, let's focus on managing investment risks effectively.`;
        break;
      default:
        response = 'I can help you make informed financial decisions based on your profile and market conditions.';
    }

    return {
      response,
      confidence: confidenceScore,
      context: {
        userProfile: financialData,
        previousContext: this.conversationContext,
        category
      }
    };
  }
}

export default ChatbotGRU;