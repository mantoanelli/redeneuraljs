export default class Matrix{
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;

        this.data =[];
        for(let i=0; i<rows; i++){
            let arr = [];
            for(let j=0; j<cols; j++){
                arr.push(Math.floor(Math.random()*10))
            }
            this.data.push(arr)
        }
    }

    map(func){
        this.data = this.data.map((arr,i)=>{
            return arr.map((num,j)=>{
                return func(num,i,j);
            })
        })
    }

    static map(A, func) {
        let matrix = new Matrix(A.rows, A.cols);

        matrix.data = A.data.map((arr, i) => {
            return arr.map((num, j) => {
                return func(num, i, j);
            })
        })

        return matrix;
    }

    randomize(){
        this.map((elem,i,j)=>{
            return Math.random()*2-1;
        })
    }

    print(){
        console.table(this.data);
    }

    static arrayToMatrix(arr){
        let matrix = new Matrix(arr.length,1);

        matrix.map((elem,i,j)=>{
            return arr[i]
        });
        return matrix;
        //matrix.print();
    }
    
    static MatrixToArray(obj) {
        let arr = []
        obj.map((elm, i, j) => {
            arr.push(elm);
        })
        return arr;
    }

    static add(A,B){
        var matrix = new Matrix(A.rows,B.cols);
        matrix.map((num,i,j)=>{
            return A.data[i][j] + B.data[i][j];
        });
        return matrix;
    }

    static subtract(A,B){
        var matrix = new Matrix(A.rows,B.cols);
        matrix.map((num,i,j)=>{
            return A.data[i][j] - B.data[i][j];
        });
        return matrix;
    }

    static escalar_multiply(A,escalar){
        var matrix = new Matrix(A.rows,A.cols);
        matrix.map((num,i,j)=>{
            return A.data[i][j] * escalar;
        });
        return matrix;
    }

    static transpose(A){
        var matrix = new Matrix(A.cols,A.rows);
        matrix.map((num,i,j)=>{
            return A.data[j][i];
        });
        return matrix;
    }

    static hadamard(A,B){
        var matrix = new Matrix(A.rows,B.cols);
        matrix.map((num,i,j)=>{
            return A.data[i][j] * B.data[i][j];
        });
        return matrix;
    }

    static multiply(A,B){  
        var matrix = new Matrix(A.rows,B.cols);
        matrix.map((num,i,j)=>{
            let sum = 0;
            for(let k=0; k<A.cols; k++){
                let elem1 = A.data[i][k];
                let elem2 = B.data[k][j];
                sum += elem1 * elem2;
            }
            return sum;
        });
        return matrix;
    }
}