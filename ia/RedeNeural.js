import Matrix from './Matrix.js';

function sigmoid(x){
    return 1/(1+Math.exp(-x));
}

function dsigmoid(x){
    return x * (1-x);
}

export default class RedeNeural{
    constructor(i_nodes,h_nodes,o_nodes, learning_rate){
        this.i_nodes = i_nodes;
        this.h_nodes = h_nodes;
        this.o_nodes = o_nodes;

        this.bias_ih = new Matrix(this.h_nodes,1);
        this.bias_ih.randomize();

        this.bias_ho = new Matrix(this.o_nodes,1);
        this.bias_ho.randomize();

        this.weigths_ih = new Matrix(this.h_nodes, this.i_nodes);
        this.weigths_ih.randomize();

        this.weigths_ho = new Matrix(this.o_nodes, this.h_nodes);
        this.weigths_ho.randomize();

        if(learning_rate){
            this.learning_rate=learning_rate;
        }else{
            this.learning_rate = 0.15;
        }

        this.generation=0;
    }

    train(arr,target){
        //FeedForward
        let input = Matrix.arrayToMatrix(arr);
        
        //  input >> hidden
        let hidden = Matrix.multiply(this.weigths_ih, input);
        hidden = Matrix.add(hidden, this.bias_ih);
        hidden.map(sigmoid);

        //  hidden >> output
        let output = Matrix.multiply(this.weigths_ho, hidden);
        output = Matrix.add(output, this.bias_ho);
        output.map(sigmoid);

        //Backpropagation

        //  output >> hidden
        let expected = Matrix.arrayToMatrix(target);
        let output_err = Matrix.subtract(expected,output);
        let d_output = Matrix.map(output,dsigmoid);
        
        let hidden_t = Matrix.transpose(hidden);

        let gradient = Matrix.hadamard(output_err, d_output);
        gradient=Matrix.escalar_multiply(gradient, this.learning_rate);

        this.bias_ho = Matrix.add(this.bias_ho,gradient);

        let weigths_ho_deltas = Matrix.multiply(gradient,hidden_t);
        this.weigths_ho = Matrix.add(this.weigths_ho,weigths_ho_deltas);
        //this.weigths_ho.print();

        // hidden >> input
        let weigths_ho_t = Matrix.transpose(this.weigths_ho);
        let hidden_err = Matrix.multiply(weigths_ho_t,output_err);
        let d_hidden = Matrix.map(hidden,dsigmoid);
        let input_t = Matrix.transpose(input);

        let gradient_h = Matrix.hadamard(hidden_err,d_hidden);
        gradient_h = Matrix.escalar_multiply(gradient_h, this.learning_rate);

        this.bias_ih = Matrix.add(this.bias_ih,gradient_h);

        let weigths_ih_deltas = Matrix.multiply(gradient_h, input_t);
        this.weigths_ih = Matrix.add(this.weigths_ih,weigths_ih_deltas);

    }

    predict(arr){
        let input = Matrix.arrayToMatrix(arr);

        //input >> hidden
        let hidden = Matrix.multiply(this.weigths_ih, input);
        hidden = Matrix.add(hidden, this.bias_ih);
        hidden.map(sigmoid);

        //hidden >> output
        let output = Matrix.multiply(this.weigths_ho, hidden);
        output = Matrix.add(output, this.bias_ho);
        output.map(sigmoid);
        output = Matrix.MatrixToArray(output);
        return output;


    }
}