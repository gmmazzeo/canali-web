function BufferedTokens() {
    this.resultSets = [];
    this.size = 0;
}

BufferedTokens.prototype.addResults = function (string, sortedAndFilteredTokens) {
    if (sortedAndFilteredTokens.length === 0) {
        return;
    }
    var rs = new ResultSet(string, sortedAndFilteredTokens);
    this.size++;
    this.resultSets.push(rs);
};

BufferedTokens.prototype.removeLastResults = function () {
    if (this.size > 0) {
        this.size--;
        this.resultSets.pop();
    }
};

BufferedTokens.prototype.clear = function () {
    for (var i = 0; i< this.size; i++) {
        this.resultSets.pop();
    }
    this.size = 0;
};


BufferedTokens.prototype.removeResults = function (string) {
    for (var i = this.size; i >= 0; i--) {
        var rs = this.resultSets[i];
        if (rs.string.indexOf(string) === 0) {
            this.size--;
            this.resultSets.pop();
        } else {
            break;
        }
    }
};

BufferedTokens.prototype.getToken = function (string, threshold) {
    if (this.size === 0) {
        return null;
    }

    var lastResultSet = this.resultSets[this.size - 1];
    if (lastResultSet.maxSimilarity >= threshold && !lastResultSet.hasPrefixWithMaxSimilarity) { //it is possibile to return the best tokens
        var res = [];
        var i = 0;
        while (i < lastResultSet.tokens.length && lastResultSet.tokens[i].sim === lastResultSet.maxSimilarity) {
            res.push(lastResultSet.tokens[i]);
            i++;
        }
        return new ResultSet(lastResultSet.string, res);
    }
    //now check if previously there was a candidate
    var i = this.size - 2;
    var nextResultSet = lastResultSet;
    while (i >= 0) {
        var currentResultSet = this.resultSets[i];
        if (currentResultSet.maxSimilarity >= threshold && currentResultSet.maxSimilarity > nextResultSet.maxSimilarity) {
            var res = [];
            var j = 0;
            while (j < currentResultSet.tokens.length && currentResultSet.tokens[j].sim === currentResultSet.maxSimilarity) {
                //currentResultSet.tokens[j] was a token with maximum similarity, above the threshold
                //if currentResultSet.tokens[j] is not in the nextResultSet.tokens with maximum similarity, then currentResultSet.tokens[j] should have been accepted
                var found = false;
                var k = 0;
                while (k < nextResultSet.tokens.length && nextResultSet.tokens[k].sim === nextResultSet.maxSimilarity) {
                    if (nextResultSet.tokens[k].l === currentResultSet.tokens[j].l) {
                        found = true;
                        break;
                    }
                    if (!found) {
                        res.push(currentResultSet.tokens[j]);
                    }
                    k++;
                }
                j++;
            }
            if (res.length > 0) {
                return new ResultSet(currentResultSet.string, res);
            }
        }
        nextResultSet = currentResultSet;
        i--;
    }
    return null;
};


function ResultSet(string, sortedAndFilteredTokens) {
    this.string = string;
    this.position = string.length - 1;
    this.tokens = sortedAndFilteredTokens;
    if (sortedAndFilteredTokens.length > 0) {
        this.maxSimilarity = sortedAndFilteredTokens[0].sim;
        var i = 0;
        while (i < sortedAndFilteredTokens.length && !sortedAndFilteredTokens[i].ip && sortedAndFilteredTokens[i].sim === sortedAndFilteredTokens[0].sim) {
            i++;
        }
        this.hasPrefixWithMaxSimilarity = !(i === sortedAndFilteredTokens.length || sortedAndFilteredTokens[i].sim !== sortedAndFilteredTokens[0].sim);
    } else {
        this.maxSimilarity = 0;
        this.hasPrefixWithMaxSimilarity = false;
    }
}