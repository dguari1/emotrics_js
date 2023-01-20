import {Matrix,solve} from 'ml-matrix';

export function circleFromPoints(p1,p2,p3,p4) {
    // function to compute the center and radius of a circle based on points around the circle 
    // the function uses least squares to find the radius that minimizes the distance between 
    // the circle and the points
    var x = new Matrix.rowVector([p1[0], p2[0], p3[0], p4[0]])
    var y = new Matrix.rowVector([p1[1], p2[1], p3[1], p4[1]])
    const xMean = x.mean()
    const yMean = y.mean()
    

    const u = Matrix.sub(x, xMean)
    const v = Matrix.sub(y, yMean)

    
    const Suv = Matrix.mul(u,v).sum()
    const Suu = Matrix.mul(u,u).sum()
    const Svv = Matrix.mul(v,v).sum()
    const Suuv = Matrix.mul(u, Matrix.mul(u,v)).sum()
    const Suvv = Matrix.mul(u, Matrix.mul(v,v)).sum()
    const Suuu = Matrix.mul(u, Matrix.mul(u,u)).sum()
    const Svvv = Matrix.mul(v, Matrix.mul(v,v)).sum()

    const A = new Matrix ([
        [Suu, Suv], 
        [Suv, Svv]
    ])
    const B = new Matrix ([
        [Suuu + Suvv], 
        [Svvv + Suuv]
    ])
    B.div(2)

    const solution = solve(A,B)
    const xCenter = xMean + solution.data[0][0]
    const yCenter = yMean + solution.data[1][0]

    const radiusX = Matrix.sub(x, xCenter)
    const radiusY = Matrix.sub(y, yCenter)
    const radius =  Matrix.sqrt(Matrix.add(radiusX.mul(radiusX),radiusY.mul(radiusY))).mean()
    
    return [xCenter, yCenter, radius]
}

// function to compute the average of an array of numbers  
export function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

