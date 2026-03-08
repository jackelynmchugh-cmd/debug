export function solveContract(type,data)
{
    switch(type)
    {
        case "Find Largest Prime Factor":
            return largestPrimeFactor(data)

        case "Subarray with Maximum Sum":
            return maxSubarray(data)

        case "Total Ways to Sum":
            return waysToSum(data)

        default:
            return null
    }
}

function largestPrimeFactor(n)
{
    let factor = 2

    while(factor * factor <= n)
    {
        if(n % factor === 0)
            n /= factor
        else
            factor++
    }

    return n
}

function maxSubarray(arr)
{
    let max = arr[0]
    let current = arr[0]

    for(let i=1;i<arr.length;i++)
    {
        current = Math.max(arr[i],current+arr[i])
        max = Math.max(max,current)
    }

    return max
}

function waysToSum(n)
{
    const dp = Array(n+1).fill(0)
    dp[0] = 1

    for(let i=1;i<n;i++)
    {
        for(let j=i;j<=n;j++)
        {
            dp[j] += dp[j-i]
        }
    }

    return dp[n]
}