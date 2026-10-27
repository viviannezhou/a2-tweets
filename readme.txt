--Readme document for Vivianne Zhou, zhouvj@uci.edu--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 3/3 Summarizing tweets
- 4/4 Identifying the most popular activities
- 3/3 Adding a text search interface

2. How long, in hours, did it take you to complete this assignment?

About 11-13 hours.

3. What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials; describe queries to Generative AI or use of AI-based code completion)

- IN4MATX 133 lecture slides (JavaScript, DOM manipulation, TypeScript, and Vega-Lite)
- Epstein et al., "From 'Nobody Cares' to 'Way to Go!'" (CSCW 2015), for the tweet categories and the idea of default vs. user-written text
- Andre Abtahi's A2 setup guide (https://inf133-wi26.depstein.net/assignments/a2_guide.pdf), for understanding each file's role and setting up the workspace
- https://vega.github.io/vega-lite/docs/ (mark, encoding, aggregate)
- https://mathjs.org/docs/reference/functions/format.html (formatting percentages)
- Claude (Anthropic): I used Claude as a tutor throughout. For Parts 1 and 3, it explained the tweet patterns and concepts (getters, filter, DOM, event listeners) and gave me skeleton code with blanks to fill in. I wrote the code myself and had it check my work and help me debug. For Part 2, it gave me worked examples for activityType and the Vega-Lite chart specs, which I went through and adapted (for example, adding tooltips and a chart title), and I wrote distance, the top-3 spans, and the means chart myself. It also helped me troubleshoot a couple of setup issues (a failed install from low storage, and a broken clone).
- GitHub Copilot autocomplete suggestions popped up in VS Code. I used some of them, but usually adjusted them or didn't use them at all.

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

None

5. Is there anything special we need to know in order to run your code?

- Nothing special. Run tsc --p tsconfig.json to generate js/tweet.js, then open index.html with a live server. On the search page, searching ignores capitalization, and every link in a tweet is clickable.
- Bonus: I added a Sentiment column to the search table on the descriptions page. Each tweet is labeled positive, negative, or neutral by counting how many positive and negative words appear in the written text. It’s simple word matching, so it doesn’t catch things like “not bad”.