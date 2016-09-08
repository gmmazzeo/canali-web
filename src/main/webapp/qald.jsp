<%-- 
    Document   : desc
    Created on : Jul 31, 2015, 2:44:07 PM
    Author     : Giuseppe M. Mazzeo <mazzeo@cs.ucla.edu>
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/normalize.min.css" />
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/main.css" />
        <style>
            th {align: center;}
            td,th {padding: 10px;}
            table.header-table {
                border-width: 0;
            }
            table.header-table td,th {
                border-spacing: 20px;
                padding: 10px
            }
            table.results {
                border: 1px solid black;
            }
            table.results td, th {
                border: 1px solid black;
            }
            td.partial {
                background-color: yellow;
            }
            td.wrong {
                background-color: red;
            }
            td.unprocessed {
                background-color: darkgray;
            }
        </style>
        <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-68452078-1', 'auto');
            ga('send', 'pageview');
        </script>        
    </head>
    <body id="top">
        <div class="header-container">
            <header class="wrapper clearfix">
                <table class="header-table">
                    <tr>
                        <td><img src="http://yellowstone.cs.ucla.edu/wis/img/logo1.jpg" width="200" alt="ScAI"> </td>
                        <td>    <div class="title-container">
                                <h1 class="title">CANaLI: a Context-Aware controlled Natural Language Interface</h1>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="nav-container">
                    <nav>
                        <ul>
                            <li><a href="about.jsp">About</a></li>
                            <li><a href="index.jsp">Demo</a></li>
                            <li><a href="qald.jsp">Experiments</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
        <div style="margin:20px;">
            <a href="#qald3">Results obtained on QALD-3 DBpedia</a><br />
            <a href="#qald3m">Results obtained on QALD-3 MusicBrainz</a><br />
            <a href="#qald4">Results obtained on QALD-4 DBpedia</a><br />
            <a href="#qald4b">Results obtained on QALD-4 Biomedical data</a><br />
            <a href="#qald5">Results obtained on QALD-5 DBpedia</a><br />
            <h2 id="qald3">Results obtained on QALD-3 DBpedia (<a href="#top">&uarr;</a>)</h2>
            <b>Summary results</b><br />
            <table class="results">
                <tr><th title="Total number of questions in the benchmark">Questions</th><th title="Number of questions that can be processed by CANaLI">Processed</th><th title="Number of questions with correct answer, i.e., F-measure=1">Correct</th><th title="Number of questions with partial answer, i.e., strictly between 0 and 1">Partial</th><th title="Average recall on the processed questions">Recall P.</th><th title="Average precision on the processed questions">Precision P.</th><th title="Average F-measure on the processed questions">F-measure P.</th><th title="Average recall on all the questions">Recall T.</th><th title="Average precision on all the questions">Precision T.</th><th title="Average F-measure on all the questions">F-measure T.</th></tr>
                <tr><td>99</td><td>99</td><td>92</td><td>7</td><td>0.9770</td><td>0.9999</td><td>0.9842</td><td>0.9770</td><td>0.9999</td><td>0.9842</td></tr>
            </table>            
            <br />
            <b>Detailed results</b><br /> 
            <table class="results">
                <tr><th>QID</th><th>Original question</th><th>Rephrased question</th><th>Recall</th><th>Precision</th><th>F-measure</th></tr>
                <tr><td>1</td><td>Which German cities have more than 250000 inhabitants?</td><td>What are the cities having country Germany and population total greater than 250000?</td><td class="partial">16/24=0.67</td><td>16/16=1</td><td class="partial">0.8</td></tr>
                <tr><td>2</td><td>Who was the successor of John F. Kennedy? </td><td>Who is the successor of John F. Kennedy?</td><td>3/3=1</td><td>3/3=1</td><td>1</td></tr>
                <tr><td>3</td><td>Who is the mayor of Berlin?</td><td>Who is the leader of Berlin?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>4</td><td>How many students does the Free University in Amsterdam have?</td><td>What is the number of students of VU University Amsterdam?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>5</td><td>What is the second highest mountain on Earth?</td><td>What is the mountain with the 2nd greatest elevation (μ)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>6</td><td>Give me all professional skateboarders from Sweden.</td><td>Give me the people having occupation Skateboarding and born in Sweden.</td><td class="partial">1/2=0.5</td><td>1/1=1</td><td class="partial">0.67</td></tr>
                <tr><td>7</td><td>When was Alberta admitted as province? </td><td>What is the admittance date of Alberta?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>8</td><td>To which countries does the Himalayan mountain system extend?</td><td>What are the country of Himalayas?</td><td>5/5=1</td><td>5/5=1</td><td>1</td></tr>
                <tr><td>9</td><td>Give me a list of all trumpet players that were bandleaders.</td><td>Give me the people having occupation Bandleader and instrument Trumpet.</td><td>69/69=1</td><td>69/69=1</td><td>1</td></tr>
                <tr><td>10</td><td>What is the total amount of men and women serving in the FDNY?</td><td>What is the number of serving men and women of New York City Fire Department?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>11</td><td>Who is the Formula 1 race driver with the most races?</td><td>Who is the formula one racer with the greatest number of races?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>12</td><td>Give me all world heritage sites designated within the past five years.</td><td>Give me the world heritage sites having year greater than 2009.</td><td class="partial">72/74=0.97</td><td>72/72=1</td><td class="partial">0.99</td></tr>
                <tr><td>13</td><td>Who is the youngest player in the Premier League?</td><td>Who is the soccer player having the greatest birth date and team having league Premier League?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>14</td><td>Give me all members of Prodigy.</td><td>Give me the band member of The Prodigy.</td><td>3/3=1</td><td>3/2=1</td><td>1</td></tr>
                <tr><td>15</td><td>What is the longest river?</td><td>What is the river having the greatest length?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>16</td><td>Does the new Battlestar Galactica series have more episodes than the old one?</td><td>Is the number of episodes of Battlestar Galactica (2004 TV series) greater than that of Battlestar Galactica (1978 TV series)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>17</td><td>Give me all cars that are produced in Germany.</td><td>Give me the automobiles having manufacturer with location country Germany.</td><td class="partial">80/315=0.25</td><td>80/80=1</td><td class="partial">0.41</td></tr>
                <tr><td>19</td><td>Give me all people that were born in Vienna and died in Berlin.</td><td>Give me the people born in Vienna who died in Berlin.</td><td>13/13=1</td><td>13/13=1</td><td>1</td></tr>
                <tr><td>20</td><td>How tall is Michael Jordan?</td><td>What is the height (μ) of Michael Jordan?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>21</td><td>What is the capital of Canada?</td><td>What is the capital of Canada?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>22</td><td>Who is the governor of Wyoming?</td><td>Who is the governor of Wyoming?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>23</td><td>Do Prince Harry and Prince William have the same mother?</td><td>Is the mother of Prince William, Duke of Cambridge the same as that of Prince Harry?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>24</td><td>Who was the father of Queen Elizabeth II?</td><td>Who is the father of Elizabeth II?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>25</td><td>Which U.S. state has been admitted latest?</td><td>What is the U.S. state with the greatest admittance date?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>26</td><td>How many official languages are spoken on the Seychelles?</td><td>What is the count of language of Seychelles?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>27</td><td>Sean Parnell is the governor of which U.S. state?</td><td>What is the U.S. state governed by Sean Parnell?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>28</td><td>Give me all movies directed by Francis Ford Coppola.</td><td>Give me the movies directed by Francis Ford Coppola.</td><td>30/30=1</td><td>30/30=1</td><td>1</td></tr>
                <tr><td>29</td><td>Give me all actors starring in movies directed by and starring William Shatner.</td><td>Give me the actors starring in movies directed by William Shatner starring William Shatner.</td><td>12/12=1</td><td>12/12=1</td><td>1</td></tr>
                <tr><td>30</td><td>What is the birth name of Angela Merkel?</td><td>What is the birth name of Angela Merkel?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>31</td><td>Give me all current Methodist national leaders.</td><td>Give me the current national leaders having religion Methodism.</td><td>3/3=1</td><td>3/3=1</td><td>1</td></tr>
                <tr><td>32</td><td>How often did Nicole Kidman marry?</td><td>What is the count of spouse of Nicole Kidman?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>33</td><td>Give me all Australian nonprofit organizations.</td><td>Give me the organisations having type Nonprofit organization and having location having country Australia.</td><td class="partial">16/20=0.8</td><td>16/16=1</td><td class="partial">0.89</td></tr>
                <tr><td>34</td><td>In which military conflicts did Lawrence of Arabia participate?</td><td>What are the military conflict of Lawrence of Arabia?</td><td>10/10=1</td><td>10/10=1</td><td>1</td></tr>
                <tr><td>35</td><td>Who developed Minecraft?</td><td>Who is the developer of Minecraft?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>36</td><td>What is the melting point of copper? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>37</td><td>Give me all sister cities of Brno. (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>38</td><td>How many inhabitants does Maribor have?</td><td>What is the population total of Maribor?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>39</td><td>Give me all companies in Munich.</td><td>Give me the companies having location Munich.</td><td class="partial">65/120=0.54</td><td>65/65=1</td><td class="partial">0.7</td></tr>
                <tr><td>40</td><td>List all games by GMT.</td><td>Give me the games published by GMT Games.</td><td>7/7=1</td><td>7/7=1</td><td>1</td></tr>
                <tr><td>41</td><td>Who founded Intel?</td><td>Who is the founder of Intel?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>42</td><td>Who is the husband of Amanda Palmer?</td><td>Who is the spouse of Amanda Palmer?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>43</td><td>Give me all breeds of the German Shepherd dog.</td><td>Give me the specimen of German Shepherd.</td><td>10/10=1</td><td>10/10=1</td><td>1</td></tr>
                <tr><td>44</td><td>Which cities does the Weser flow through?</td><td>What are the city of Weser?</td><td> 7/7=1</td><td> 7/7=1</td><td>1</td></tr>
                <tr><td>45</td><td>Which countries are connected by the Rhine?</td><td>What are the country of Rhine?</td><td>5/5=1</td><td>5/5=1</td><td>1</td></tr>
                <tr><td>46</td><td>Which professional surfers were born on the Philippines?</td><td>Who are the people having occupation Surfing and born in Philippines?</td><td> 1/1=1</td><td> 1/1=1</td><td>1</td></tr>
                <tr><td>47</td><td>What is the average temperature on Hawaii? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>48</td><td>In which UK city are the headquarters of the MI6?</td><td>What is the settlement headquarter of MI6?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>49</td><td>Which other weapons did the designer of the Uzi develop?</td><td>What are the weapons having designer the same as that of Uzi having name different than that of Uzi?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>50</td><td>Was the Cuban Missile Crisis earlier than the Bay of Pigs Invasion?</td><td>Is the date of Cuban missile crisis less than that of Bay of Pigs Invasion?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>51</td><td>Give me all Frisian islands that belong to the Netherlands.</td><td>Give me the frisian islands having country Netherlands.</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>                
                <tr><td>52</td><td>Who invented the zipper? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>53</td><td>What is the ruling party in Lisbon?</td><td>What is the leader party of Lisbon?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>54</td><td>What are the nicknames of San Francisco?</td><td>What are the nickname of San Francisco?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>55</td><td>Which Greek goddesses dwelt on Mount Olympus?</td><td>Who are the greek goddesses dwelling on Mount Olympus?</td><td>12/12=1</td><td>12/12=1</td><td>1</td></tr>
                <tr><td>56</td><td>When were the Hells Angels founded?</td><td>What is the foundation date of Hells Angels?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>57</td><td>Give me the Apollo 14 astronauts. </td><td>Give me the astronauts having mission Apollo 14.</td><td>3/3=1</td><td>3/3=1</td><td>1</td></tr>
                <tr><td>58</td><td>What is the time zone of Salt Lake City?</td><td>What is the timezone of Salt Lake City?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>59</td><td>Which U.S. states are in the same timezone as Utah?</td><td>What are the U.S. states having timezone equal to that of Utah having name different than that of Utah?</td><td>48/48=1</td><td>48/48=1</td><td>1</td></tr>
                <tr><td>60</td><td>Give me a list of all lakes in Denmark.</td><td>Give me the lakes having country Denmark.</td><td>4/4=1</td><td>4/4=1</td><td>1</td></tr>
                <tr><td>61</td><td>How many space missions have there been?</td><td>What is the count of space missions?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>62</td><td>Did Socrates influence Aristotle?</td><td>Is there a influencer of Aristotle equal to Socrates?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>63</td><td>Give me all Argentine films.</td><td>Give me the films having country "Argentina".</td><td class="partial">1442/1454=0.99</td><td class="partial">1442/1473=0.98</td><td class="partial">0.99</td></tr>
                <tr><td>64</td><td>Give me all launch pads operated by NASA.</td><td>Give me the launch pads operated by NASA.</td><td>7/7=1</td><td>7/7=1</td><td>1</td></tr>
                <tr><td>65</td><td>Which instruments did John Lennon play?</td><td>What are the instrument of John Lennon?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>66</td><td>Which ships were called after Benjamin Franklin?</td><td>What are the ship called after of Benjamin Franklin?</td><td>4/4=1</td><td>4/4=1</td><td>1</td></tr>
                <tr><td>67</td><td>Who are the parents of the wife of Juan Carlos I?</td><td>Who are the parent of spouse of Juan Carlos I of Spain?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>68</td><td>How many employees does Google have?</td><td>What is the number of employees of Google?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>69</td><td>Did Tesla win a nobel prize in physics?</td><td>Is there a award of Nikola Tesla equal to Nobel Prize in Physics?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>70</td><td>Is Michelle Obama the wife of Barack Obama?</td><td>Is the spouse of Barack Obama equal to Michelle Obama?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>71</td><td>When was the Statue of Liberty built?</td><td>What is the beginning date of Statue of Liberty?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>72</td><td>In which U.S. state is Fort Knox located?</td><td>What is the location of Fort Knox?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>73</td><td>How many children did Benjamin Franklin have?</td><td>What is the count of child of Benjamin Franklin?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>74</td><td>When did Michael Jackson die?</td><td>What is the death date of Michael Jackson?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>75</td><td>Which daughters of British earls died in the same place they were born in?</td><td>Who are the daughter of british earls having death place equal to their birth place?</td><td>8/8=1</td><td>8/8=1</td><td>1</td></tr>
                <tr><td>76</td><td>List the children of Margaret Thatcher.</td><td>Give me the child of Margaret Thatcher.</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>77</td><td>Who was called Scarface?</td><td>Who is the person having nickname "Scarface"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>78</td><td>Was Margaret Thatcher a chemist?</td><td>Is the profession of Margaret Thatcher equal to Chemist?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>79</td><td>Was Dutch Schultz a jew?</td><td>Is the ethnicity of Dutch Schultz equal to "jewish"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>80</td><td>Give me all books by William Goldman with more than 300 pages.</td><td>Give me the books having author William Goldman and number of pages greater than 300.</td><td>10/10=1</td><td>10/10=1</td><td>1</td></tr>
                <tr><td>81</td><td>Which books by Kerouac were published by Viking Press?</td><td>What are the books having author Jack Kerouac published by Viking Press?</td><td>3/3=1</td><td>3/3=1</td><td>1</td></tr>
                <tr><td>82</td><td>Give me a list of all American inventions.</td><td>Give me the american inventions.</td><td>135/135=1</td><td>135/135=1</td><td>1</td></tr>
                <tr><td>83</td><td>How high is the Mount Everest?</td><td>What is the elevation (μ) of Mount Everest?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>84</td><td>Who created the comic Captain America?</td><td>Who is the creator of Captain America?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>85</td><td>How many people live in the capital of Australia?</td><td>What is the population total of capital of Australia?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>86</td><td>What is the largest city in Australia?</td><td>What is the largest city of Australia?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>87</td><td>Who composed the music for Harold and Maude?</td><td>Who is the music composer of Harold and Maude?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>88</td><td>Which films starring Clint Eastwood did he direct himself?</td><td>What are the films directed by Clint Eastwood starring Clint Eastwood?</td><td>17/17=1</td><td>17/17=1</td><td>1</td></tr>
                <tr><td>89</td><td>In which city was the former Dutch queen Juliana buried?</td><td>What is the city equal to resting place of Juliana of the Netherlands?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>90</td><td>Where is the residence of the prime minister of Spain?</td><td>What is the residence of Prime Minister of Spain?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>91</td><td>Which U.S. state has the abbreviation MN?</td><td>What is the U.S. state having postal abbreviation "MN"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>92</td><td>Show me all songs from Bruce Springsteen released between 1980 and 1990.</td><td>Give me the songs having artist Bruce Springsteen and release date greater than 1979-12-31 and release date less than 1991-01-01.</td><td>6/6=1</td><td>6/6=1</td><td>1</td></tr>
                <tr><td>93</td><td>Which movies did Kurosawa direct after Rashomon?</td><td>Give me the movies directed by Akira Kurosawa having release date greater than that of Rashomon.</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>94</td><td>What is the founding year of the brewery that produces Pilsner Urquell?</td><td>What is the founding year of brewery of Pilsner Urquell?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>95</td><td>Who wrote the lyrics for the Polish national anthem?</td><td>Who is the author of anthem of Poland?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>                
                <tr><td>96</td><td>Give me all B-sides of the Ramones.</td><td>Give me the b-side of singles having musical artist Ramones.</td><td>10/10=1</td><td>10/10=1</td><td>1</td></tr>
                <tr><td>97</td><td>Who painted The Storm on the Sea of Galilee?</td><td>Who is the artist of The Storm on the Sea of Galilee?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>98</td><td>Which country does the creator of Miffy come from?</td><td>What is the nationality of creator of Miffy?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>99</td><td>For which label did Elvis record his first album?</td><td>What is the record label of album with artist Elvis Presley having the smallest release date?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>100</td><td>Who produces Orangina?</td><td>Who is the producer of Orangina?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
            </table>
            <br />
            <h2 id="qald3m">Results obtained on QALD-3 MusicBrainz (<a href="#top">&uarr;</a>)</h2>
            <b>Summary results</b><br />
            <table class="results">
                <tr><th title="Total number of questions in the benchmark">Questions</th><th title="Number of questions that can be processed by CANaLI">Processed</th><th title="Number of questions with correct answer, i.e., F-measure=1">Correct</th><th title="Number of questions with partial answer, i.e., strictly between 0 and 1">Partial</th><th title="Average recall on the processed questions">Recall P.</th><th title="Average precision on the processed questions">Precision P.</th><th title="Average F-measure on the processed questions">F-measure P.</th><th title="Average recall on all the questions">Recall T.</th><th title="Average precision on all the questions">Precision T.</th><th title="Average F-measure on all the questions">F-measure T.</th></tr>
                <tr><td>50</td><td>45</td><td>45</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0.9</td><td>0.9</td><td>0.9</td></tr>
            </table>
            <br />
            <b>Detailed results</b><br /> 
            <table class="results">
                <tr><th>QID</th><th>Original question</th><th>Rephrased question</th><th>Recall</th><th>Precision</th><th>F-measure</th></tr>
                <tr><td>1</td><td>Which groups were founded in 1924?</td><td>What are the groups having event birth having date with year equal to 1924?</td><td>8/8=1</td><td>8/8=1</td><td>1</td></tr>
                <tr><td>2</td><td>Who produced the album Dookie?</td><td>Who is the producer of Dookie?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>4</td><td>Give me all solo artists who contributed to more than three collaborations.</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>5</td><td>How many tracks does Erotica have?</td><td>What is the count of track of record having title "Erotica"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>6</td><td>Who composed the soundtrack for Blade Runner?</td><td>Who is the composer of Blade Runner?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>7</td><td>Which artists turned 60 on May 15, 2011?</td><td>Who are the artists having event birth with date 1951-05-15?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>8</td><td>Is Bugs a track on the album Vitalogy?</td><td>Is there a track of Vitalogy equal to Bugs?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>9</td><td>Who is the singer on the album The Dark Side of the Moon?</td><td>Who is the singer of The Dark Side of the Moon?</td><td>7/7=1</td><td>7/7=1</td><td>1</td></tr>
                <tr><td>11</td><td>How long is Louder Than Words by Against All Authority?</td><td>What is the duration of the track with title "Louder Than Words" made by Against All Authority?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>12</td><td>Give me all albums which have the name of their artist as their title.</td><td>Give me the records having release type album having name equal to that of their maker.</td><td>18376/18376=1</td><td>18376/18376=1</td><td>1</td></tr>
                <tr><td>13</td><td>Was the album Coming Home created by Lionel Richie?</td><td>Is there a record with title "Coming Home" made by Lionel Richie?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>14</td><td>How many singles did the Scorpions release?</td><td>What is the count of records having release type single made by Scorpions?</td><td>18/18=1</td><td>18/18=1</td><td>1</td></tr>
                <tr><td>15</td><td>Who composed the song Coast to Coast?</td><td>Who is the maker of track having title "Coast to Coast"?</td><td>12/12=1</td><td>12/12=1</td><td>1</td></tr>
                <tr><td>16</td><td>Which bands broke up in 2000?</td><td>What are the groups having event death having date with year equal to 2000?</td><td>240/240=1</td><td>=240/240=1</td><td>1</td></tr>
                <tr><td>17</td><td>By whom is the single Pure Morning?</td><td>Who is the maker of record having release type single with title "Pure Morning"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>18</td><td>Who produced the albums Out of Time and Automatic for the People?</td><td>Who is the producer of Automatic for the People equal to that of Out of Time?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>19</td><td>With whom did Phil Collins work together?</td><td>Who are the artist having collaboration equal to that of Phil Collins having name different than that of Phil Collins?</td><td>24/24=1</td><td>24/24=1</td><td>1</td></tr>
                <tr><td>20</td><td>Give me all bands whose name starts with The.</td><td>Give me the groups having name equal to "^The ".</td><td>41893/41893=1</td><td>41893/41893=1</td><td>1</td></tr>
                <tr><td>21</td><td>How many singles did Brian Eno record?</td><td>What is the count of records having release type single made by Brian Eno?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>22</td><td>How often did Madonna marry?</td><td>What is the count of spouse of Madonna?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>23</td><td>Who was born on the same day as Tina Turner?</td><td>Who has event birth with date equal to date of birth event [inverted] Tina Turner?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>24</td><td>Which compilations contain the song Last Christmas?</td><td>What is the record having release type compilation having track with title "Last Christmas"?</td><td>32/32=1</td><td>32/32=1</td><td>1</td></tr>
                <tr><td>25</td><td>How long is the song This Magic Moment by Lou Reed?</td><td>What is the duration of track having title "This Magic Moment" made by Lou Reed?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>26</td><td>Give me all singles by Donovan.</td><td>Give me the records having release type single made by Donovan.</td><td>10/10=1</td><td>10/10=1</td><td>1</td></tr>
                <tr><td>27</td><td>What kind of record is Hijo de la luna?</td><td>What is the release type of Hijo de la luna?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>28</td><td>By whom is the song Everlong?</td><td>Who is the maker of Everlong?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>29</td><td>Which bands recorded more than 50 albums?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>30</td><td>Who was Whitney Houston's husband?</td><td>Who is the spouse of Whitney Houston?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>31</td><td>When did Ludwig van Beethoven die?</td><td>What is the date of event of Ludwig van Beethoven equal to death?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>32</td><td>How many pieces of work did Mozart create?</td><td>What is the count of musical manifestations made by Wolfgang Amadeus Mozart?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>33</td><td>When were the Dixie Chicks founded?</td><td>What is the date of event of Dixie Chicks equal to birth?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>34</td><td>When was That Which Remains founded?</td><td>What is the date of event of That Which Remains equal to birth?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>35</td><td>How many children did Bob Marley have?</td><td>What is the count of child of Bob Marley?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>36</td><td>How old is Rod Morgenstein? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>37</td><td>Give me all artists who were in a band as well as released a solo album.</td><td>Who are the artists having some band having some release having release type album?</td><td>141920/141920=1</td><td>141920/141920=1</td><td>1</td></tr>
                <tr><td>38</td><td>On which albums does the song Because You Loved Me appear?</td><td>What are the records having release type album having track with title "Because You Loved Me"?</td><td>8/8=1</td><td>8/8=1</td><td>1</td></tr>
                <tr><td>39</td><td>Does the song Peggy Sue appear on Buddy Holly's Greatest Hits compilation?</td><td>Is there a record made by Buddy Holly having release type compilation having title "Greatest Hits" with track having title "Peggy Sue"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>41</td><td>Which albums of Elvis Presley have Elvis in their title?</td><td>What are the records having release type album made by Elvis Presley having title "Elvis"?</td><td>33/33=1</td><td>33/33=1</td><td>1</td></tr>
                <tr><td>42</td><td>How many live albums by Elvis Presley are there?</td><td>What is the count of records having release type live made by Elvis Presley?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>43</td><td>Which members of The Beatles have more than one child?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>45</td><td>Give me all solo artists born in March.</td><td>Give me the solo artists having event birth having date with month equal to "03".</td><td>3474/3474=1</td><td>3474/3474=1</td><td>1</td></tr>
                <tr><td>46</td><td>Give me the titles of all singles by Phil Collins.</td><td>Give me the title of records having release type single made by Phil Collins.</td><td> 26/26=1</td><td>26/26=1</td><td>1</td></tr>
                <tr><td>48</td><td>Give me all soundtracks composed by the Pet Shop Boys.</td><td>Give me the records having release type http://purl.org/ontology/mo/soundtrack made by Pet Shop Boys.</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>49</td><td>In which language does Marco Borsato sing? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>50</td><td>On which singles did Robbie Williams collaborate with Nicole Kidman?</td><td>Give me the records having release type single made by Robbie Williams & Nicole Kidman.</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>51</td><td>Did Kylie Minogue ever collaborate with Mariah Carey?</td><td>Is there a collaboration of Kylie Minogue equal to collaboration of Mariah Carey?</td><td> 1/1=1</td><td> 1/1=1</td><td>1</td></tr>
                <tr><td>52</td><td>In which countries was the single Incomplete published? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>53</td><td>Which group had 70 members?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>54</td><td>What is the legal name of Loona? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>55</td><td>Which member of Take That recorded the most albums?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
            </table>
            <br />            
            <h2 id="qald4">Results obtained on QALD-4 DBpedia (<a href="#top">&uarr;</a>)</h2>
            <b>Summary results</b><br />
            <table class="results">
                <tr><th title="Total number of questions in the benchmark">Questions</th><th title="Number of questions that can be processed by CANaLI">Processed</th><th title="Number of questions with correct answer, i.e., F-measure=1">Correct</th><th title="Number of questions with partial answer, i.e., strictly between 0 and 1">Partial</th><th title="Average recall on the processed questions">Recall P.</th><th title="Average precision on the processed questions">Precision P.</th><th title="Average F-measure on the processed questions">F-measure P.</th><th title="Average recall on all the questions">Recall T.</th><th title="Average precision on all the questions">Precision T.</th><th title="Average F-measure on all the questions">F-measure T.</th></tr>
                <tr><td>50</td><td>47</td><td>43</td><td>4</td><td>0.9738</td><td>0.9918</td><td>0.9763</td><td>0.9153</td><td>0.9323</td><td>0.9178</td></tr>
            </table>
            <br />
            <b>Detailed results</b><br /> 
            <table class="results">
                <tr><th>QID</th><th>Original question</th><th>Rephrased question</th><th>Recall</th><th>Precision</th><th>F-measure</th></tr>
                <tr><td>1</td><td>Give me all taikonauts.</td><td>Give me the astronauts with nationality China.</td><td>6/6=1</td><td>6/6=1</td><td>1</td></tr>
                <tr><td>2</td><td>How many languages are spoken in Colombia?</td><td>What is the count of languages spoken in Colombia?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>3</td><td>Which poet wrote the most books?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>4</td><td>How many programming languages are there?</td><td>What is the count of programming languages?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>5</td><td>Give me all Dutch parties.</td><td>Give me the political parties having country Netherlands.</td><td>12/12=1</td><td>12/12=1</td><td>1</td></tr>
                <tr><td>6</td><td>When was Carlo Giuliani shot?</td><td>What is the date of death of Death of Carlo Giuliani?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>7</td><td>Does the Isar flow into a lake?</td><td>Is there a lakes having inflow Isar?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>8</td><td>Which rivers flow into a German lake?</td><td>What are the rivers flowing into lakes having country Germany?</td><td>13/13=1</td><td>13/13=1</td><td>1</td></tr>
                <tr><td>9</td><td>How heavy is Jupiter's lightest moon?</td><td>What is the mass (g) of satellite of Jupiter with the smallest mass (g)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>10</td><td>Who is the youngest Darts player?</td><td>Who is the darts player with the greatest birth date?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>11</td><td>Give me all animals that are extinct.</td><td>Give me the animals having conservation status "ex".</td><td>962/962=1</td><td class="partial">962/1052=0.91</td><td class="partial">0.96</td></tr>
                <tr><td>12</td><td>How many pages does War and Peace have?</td><td>What is the number of pages of War and Peace?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>13</td><td>Which ingredients do I need for carrot cake?</td><td>What are the ingredient of Carrot cake?</td><td>6/6=1</td><td>6/6=1</td><td>1</td></tr>
                <tr><td>14</td><td>What is the most frequent death cause?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>15</td><td>Who has Tom Cruise been married to?</td><td>Who is the spouse of Tom Cruise?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>16</td><td>Who is the tallest player of the Atlanta Falcons?</td><td>Who is the player of Atlanta Falcons having the greatest height (μ)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>17</td><td>What is the bridge with the longest span?</td><td>What is the bridge having the greatest span?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>18</td><td>Give me all films produced by Steven Spielberg with a budget of at least $80 million.</td><td>Give me the movies produced by Steven Spielberg with budget ($) greater than 80000000.</td><td>6/6=1</td><td>6/6=1</td><td>1</td></tr>
                <tr><td>19</td><td>Is Cola a beverage?</td><td>Is there a beverage having name "Cola"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>20</td><td>Which actor was casted in the most movies?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>21</td><td>Where was Bach born?</td><td>What is the birth place of Johann Sebastian Bach?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>22</td><td>Which of Tim Burton's films had the highest budget?</td><td>What is the movie directed by Tim Burton with the greatest budget ($)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>23</td><td>Does Abraham Lincoln's death place have a website?</td><td>Is there a website of death place of Abraham Lincoln?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>24</td><td>Who are the four youngest MVP basketball players?</td><td>Who are the basketball players with highlights "MVP" having one of the 4 greatest birth date?</td><td>4/4=1</td><td>4/4=1</td><td>1</td></tr>
                <tr><td>25</td><td>What are the top-10 action role-playing video games according to IGN?</td><td>What are the video games having genre Action role-playing game with one of the greatest 10 ign?</td><td class="partial">7/10=0.7</td><td class="partial">7/10=0.7</td><td class="partial">0.7</td></tr>
                <tr><td>26</td><td>Give me all actors who were born in Berlin.</td><td>Give me the actors born in Berlin.</td><td>4/4=1</td><td>4/4=1</td><td>1</td></tr>
                <tr><td>27</td><td>Give me all actors who were born in Paris after 1950.</td><td>Give me the actors born in Paris having birth date greater than 1950-12-31.</td><td>31/31=1</td><td>31/31=1</td><td>1</td></tr>
                <tr><td>28</td><td>What was Brazil's lowest rank in the FIFA World Ranking?</td><td>What is the fifa min of Brazil national football team?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>29</td><td>Give me all Australian metalcore bands.</td><td>Give me the bands having genre Metalcore having hometown having country Australia.</td><td>17/17=1</td><td>17/17=1</td><td>1</td></tr>
                <tr><td>30</td><td>When is Halloween?</td><td>What is the date of Halloween?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>31</td><td>How many inhabitants does the largest city in Canada have?</td><td>What is the population total of largest city of Canada?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>32</td><td>In which countries can you pay using the West African CFA franc?</td><td>What are the countries having currency West African CFA franc?</td><td class="partial">9/10=0.9</td><td>9/9=1</td><td class="partial">0.95</td></tr>
                <tr><td>33</td><td>Give me the capitals of all countries that the Himalayas run through.</td><td>Give me the capital of country of Himalayas.</td><td>6/6=1</td><td>6/6=1</td><td>1</td></tr>
                <tr><td>34</td><td>Who was the first to climb Mount Everest?</td><td>Who is the first climber of Mount Everest?</td><td>4/4=1</td><td>4/4=1</td><td>1</td></tr>
                <tr><td>35</td><td>To which artistic movement did the painter of The Three Dancers belong?</td><td>What is the movement of author of The Three Dancers?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>36</td><td>Which pope succeeded John Paul II?</td><td>Who is the successor of Pope John Paul II?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>37</td><td>What was the last movie with Alec Guinness?</td><td>What is the film starring Alec Guinness with the greatest release date?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>38</td><td>How many James Bond movies are there?</td><td>What is the count of James Bond movies?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>39</td><td>Which actor played Chewbacca?</td><td>Who is the portrayer of Chewbacca?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>40</td><td>Give me the grandchildren of Bruce Lee.</td><td>Give me the child of child of Bruce Lee.</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>41</td><td>Give me all writers that won the Nobel Prize in literature.</td><td>Give me the writers having award Nobel Prize in Literature.</td><td>14/14=1</td><td>14/14=1</td><td>1</td></tr>
                <tr><td>42</td><td>What is the official color of the University of Oxford?</td><td>What is the official school colour of University of Oxford?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>43</td><td>Give me all Swedish oceanographers.</td><td>Give me the people born in Sweden having field Oceanography.</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>44</td><td>How deep is Lake Placid?</td><td>What is the depth (μ) of Lake Placid (Texas)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>45</td><td>Is James Bond married?</td><td>Is there a spouse of James Bond (literary character)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>46</td><td>Which spaceflights were launched from Baikonur?</td><td>What has launch pad Baikonur Cosmodrome?</td><td>12/12=1</td><td>12/12=1</td><td>1</td></tr>
                <tr><td>47</td><td>Give me all actors called Baldwin.</td><td>Give me the actors with birth name "Baldwin".</td><td class="partial">1/6=0.17</td><td>1/1=1</td><td class="partial">0.29</td></tr>
                <tr><td>48</td><td>What does CPU stand for?</td><td>What are the things with abbreviation "CPU"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>                
                <tr><td>49</td><td>In which studio did the Beatles record their first album? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>50</td><td>How many gold medals did Michael Phelps win at the 2008 Olympics? (OUT OF SCOPE)</td><td>CANaLI does not allow to type this question</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
            </table>
            <br />
            <h2 id="qald4b">Results obtained on QALD-4 Biomedical data (<a href="#top">&uarr;</a>)</h2>
            <b>Summary results</b><br />
            <table class="results">
                <tr><th title="Total number of questions in the benchmark">Questions</th><th title="Number of questions that can be processed by CANaLI">Processed</th><th title="Number of questions with correct answer, i.e., F-measure=1">Correct</th><th title="Number of questions with partial answer, i.e., strictly between 0 and 1">Partial</th><th title="Average recall on the processed questions">Recall P.</th><th title="Average precision on the processed questions">Precision P.</th><th title="Average F-measure on the processed questions">F-measure P.</th><th title="Average recall on all the questions">Recall T.</th><th title="Average precision on all the questions">Precision T.</th><th title="Average F-measure on all the questions">F-measure T.</th></tr>
                <tr><td>25</td><td>23</td><td>23</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0.92</td><td>0.92</td><td>0.92</td></tr>
            </table>
            <br />
            <b>Detailed results</b><br /> 
            <table class="results">
                <tr><th>QID</th><th>Original question</th><th>Rephrased question</th><th>Recall</th><th>Precision</th><th>F-measure</th></tr>
                <tr><td>1</td><td>Which genes are associated with Endothelin receptor type B?</td><td>What is the associated gene of Endothelin receptor type B?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>2</td><td>Which genes are associated with subtypes of rickets?</td><td>What is the associated gene of subtype of rickets?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>3</td><td>Which drug has the highest number of side-effects?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>4</td><td>List drugs that lead to strokes and arthrosis.</td><td>Give me the drugs with side effect stroke with side effect arthrosis.</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>5</td><td>Which drugs have a water solubility of 2.78e-01 mg/mL?</td><td>What are the drugs with predicted water solubility "2.87"?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>6</td><td>Give me the side-effects drugs with a solubility of 3.24e-02 mg/mL.</td><td>Give me the side effect of drugs with predicted water solubility "3.24".</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>7</td><td>Which diseases are associated with SAR1B?</td><td>What are the diseases having associated gene SAR1B?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>8</td><td>Which experimental drugs interact with food?</td><td>What are the drugs having drug type experimental having some food interaction?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>9</td><td>Which approved drugs interact with fibers?</td><td>What are the drugs having drug type approved having food interaction "fibers"?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>10</td><td>Which drugs interact with food and have HIV infections as side-effects?</td><td>What are the drugs having some food interaction having side effect HIV Infection?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>11</td><td>Give me diseases whose possible drugs target the elongation factor 2.</td><td>What are the indication of drugs having target Elongation factor 2?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>12</td><td>Which drugs achieve a protein binding of 100%?</td><td>What are the drugs having protein binding "100%"?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>13</td><td>List illnesses that are treated by drugs whose mechanism of action involves norepinephrine and serotonin.</td><td>Give me the indication of drugs having mechanism of action "norepinephrine" having mechanism of action "serotonin".</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>14</td><td>Which is the least common chromosome location?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>15</td><td>Are there drugs that target the Protein kinase C beta type?</td><td>Are there  drugs having target Protein kinase C beta type?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>16</td><td>Give me all diseases of the connective tissue class.</td><td>Give me the disease of connective tissue.</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>17</td><td>Which targets are involved in blood clotting?</td><td>What are the targets involved in "blood clotting"?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>18</td><td>List the number of distinct side-effects of drugs which target genes whose general function involves cell division.</td><td>Give me the count of side effect of drugs having target genes having general function "cell division".</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>19</td><td>Which drugs have no side-effects?</td><td>What are the drugs without any side effect?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>20</td><td>List diseases whose possible drugs have no side effects.</td><td>Give me the diseases having possible drug without any side effect.</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>21</td><td>Give me the drug categories of Desoxyn.</td><td>Give me the drug category of drugs with brand name "desoxyn".</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>22</td><td>Give me drugs in the gaseous state.</td><td>Give me the drugs having state "gas".</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>23</td><td>Which disease has the largest size?</td><td>What is the disease having the greatest size?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>24</td><td>Which drugs have bipolar disorder as indication?</td><td>What are the drugs having indication "bipolar disorder"?</td><td>1</td><td>1</td><td>1</td></tr>
                <tr><td>25</td><td>Which diseases have a class degree of 11?</td><td>What are the diseases having class degree 11?</td><td>1</td><td>1</td><td>1</td></tr>
            </table>
            <br />                    
            <h2 id="qald5">Results obtained on QALD-5 DBpedia (<a href="#top">&uarr;</a>)</h2>
            <b>Summary results</b><br />
            <table class="results">
                <tr><th title="Total number of questions in the benchmark">Questions</th><th title="Number of questions that can be processed by CANaLI">Processed</th><th title="Number of questions with correct answer, i.e., F-measure=1">Correct</th><th title="Number of questions with partial answer, i.e., strictly between 0 and 1">Partial</th><th title="Average recall on the processed questions">Recall P.</th><th title="Average precision on the processed questions">Precision P.</th><th title="Average F-measure on the processed questions">F-measure P.</th><th title="Average recall on all the questions">Recall T.</th><th title="Average precision on all the questions">Precision T.</th><th title="Average F-measure on all the questions">F-measure T.</th></tr>
                <tr><td>49</td><td>46</td><td>44</td><td>1</td><td>0.9770</td><td>0.9783</td><td>0.9776</td><td>0.9172</td><td>0.9184</td><td>0.9178</td></tr>
            </table>
            <br />
            <b>Detailed results</b><br /> 
            <table class="results">
                <tr><th>QID</th><th>Original question</th><th>Rephrased question</th><th>Recall</th><th>Precision</th><th>F-measure</th></tr>
                <tr><td>1</td><td>Give me all ESA astronauts.</td><td>Give me the astronauts with type European Space Agency.</td><td>23/23=1</td><td>23/23=1</td><td>1</td></tr>
                <tr><td>2</td><td>Give me all Swedish holidays.</td><td>Give me the holidays having country Sweden.</td><td>4/4=1</td><td>4/4=1</td><td>1</td></tr>
                <tr><td>3</td><td>Who is the youngest Pulitzer Prize winner?</td><td>Who is the winner of Pulitzer Prize with the greatest birth date?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>4</td><td>Which animals are critically endangered?</td><td>What are the animals with conservation status "CR"?</td><td>1621/1621=1</td><td>1621/1621=1</td><td>1</td></tr>
                <tr><td>5</td><td>Which soccer players were born on Malta?</td><td>Who are the soccer players having birth place Malta?</td><td>89/89=1</td><td>89/89=1</td><td>1</td></tr>
                <tr><td>6</td><td>Did Arnold Schwarzenegger attend a university?</td><td>Is there a alma mater of Arnold Schwarzenegger equal to university?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>7</td><td>Which programming languages were influenced by Perl?</td><td>What are the programming languages influenced by Perl?</td><td class="partial">16/17=0.94</td><td>16/16=1</td><td class="partial">0.97</td></tr>
                <tr><td>8</td><td>Is Barack Obama a democrat?</td><td>Is the party of Barack Obama equal to Democratic Party (United States)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>9</td><td>How many children does Eddie Murphy have?</td><td>What are the children of Eddie Murphy?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>10</td><td>Who is the oldest child of Meryl Streep?</td><td>Who is the child of Meryl Streep with the smallest birth date?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>11</td><td>Who killed John Lennon?</td><td>Who is the guilty of Death of John Lennon?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>12</td><td>In which city is Air China headquartered?</td><td>What is the settlement headquartering Air China?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>13</td><td>Which frequent flyer program has the most airlines?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>14</td><td>Which artists were born on the same date as Rachel Stevens?</td><td>Who are the artists having date of birth date equal to that of Rachel Stevens?</td><td>3/3=1</td><td>3/3=1</td><td>1</td></tr>
                <tr><td>15</td><td>How many scientists graduated from an Ivy League university?</td><td>What is the count of scientists having alma mater with affiliation Ivy League?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>16</td><td>Which types of grapes grow in Oregon?</td><td>What are the growing grape of Oregon wine?</td><td>34/34=1</td><td>34/34=1</td><td>1</td></tr>
                <tr><td>17</td><td>Who is starring in Spanish movies produced by Benicio del Toro?</td><td>Who is starring of movies produced by Benicio del Toro having country Spain?</td><td>10/10=1</td><td>10/10=1</td><td>1</td></tr>
                <tr><td>18</td><td>Who is the manager of Real Madrid?</td><td>Who is the manager of Real Madrid C.F.?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>19</td><td>Give me the currency of China.</td><td>Give me the currency of China.</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>20</td><td>Which movies starring Brad Pitt were directed by Guy Ritchie?</td><td>What are the movies starring Brad Pitt directed by Guy Ritchie.</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>22</td><td>How many companies were founded by the founder of Facebook?</td><td>What is the count of companies having founder equal to that of Facebook?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>23</td><td>How many companies were founded in the same year as Google?</td><td>What is the count of companies having founding year equal to that of Google?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>24</td><td>Which subsidiary of Lufthansa serves both Dortmund and Berlin Tegel?</td><td>What are the subsidiary of Lufthansa having target airport Dortmund Airport having target airport Berlin Tegel Airport?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>25</td><td>How many airlines are members of the Star Alliance?</td><td>What is the count of airlines having alliance Star Alliance?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>26</td><td>Give me all spacecrafts that flew to Mars.</td><td>Give me the spacecrafts with planet Mars.</td><td>6/6=1</td><td>6/6=1</td><td>1</td></tr>
                <tr><td>27</td><td>Which musician wrote the most books?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>28</td><td>Show me everyone who was born on Halloween.</td><td>Who has birth date equal to date of Halloween?</td><td>7/7=1</td><td>7/7=1</td><td>1</td></tr>
                <tr><td>29</td><td>Give me all Swiss non-profit organizations.</td><td>Give me the organisations with type Nonprofit organization having location having country Switzerland.</td><td>5/5=1</td><td>5/5=1</td><td>1</td></tr>
                <tr><td>30</td><td>In which country is Mecca located?</td><td>What is the country of Mecca?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>31</td><td>What is the net income of Apple?</td><td>What is the net income ($) of Apple Inc.?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>32</td><td>What does the abbreviation FIFA stand for?</td><td>What is the name of things having abbreviation "FIFA"?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>33</td><td>When did the Ming dynasty dissolve?</td><td>What is the dissolution date of Ming dynasty?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>34</td><td>Which museum in New York has the most visitors?</td><td>What is the museum with location New York having the greatest number of visitors?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>35</td><td>Is Lake Baikal bigger than the Great Bear Lake?</td><td>Is the area total (m2) of Lake Baikal greater than that of Great Bear Lake?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>36</td><td>Desserts from which country contain fish?</td><td>What is the origin of foods having type Dessert having ingredient Fish?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>37</td><td>What is the highest mountain in Italy?</td><td>What is the mountain located in area Italy having the greatest elevation (μ)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>38</td><td>Where did the architect of the Eiffel Tower study?</td><td>What is the alma mater of architect of Eiffel Tower?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>39</td><td>Which Greek parties are pro-European?</td><td>What are the political parties having country Greece having ideology Pro-Europeanism?</td><td>2/2=1</td><td>2/2=1</td><td>1</td></tr>
                <tr><td>40</td><td>What is the height difference between Mount Everest and K2?</td><td>Can not be expressed in CANaLI</td><td class="unprocessed">-</td><td class="unprocessed">-</td><td class="unprocessed">-</td></tr>
                <tr><td>41</td><td>Who is the mayor of Rotterdam?</td><td>Who is the leader name of Rotterdam?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>42</td><td>In which city were the parents of Che Guevara born? (OUT OF SCOPE)</td><td>What is the birth place of parents of Che Guevara?</td><td>(0/0) 1</td><td>(0/0) 1</td><td>1</td></tr>
                <tr><td>43</td><td>How high is the Yokohama Marine Tower?</td><td>What is the height (μ) of Yokohama Marine Tower?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>44</td><td>Are Taiko a kind of Japanese musical instruments?</td><td>Are there japanese musical instruments equal to Taiko?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>45</td><td>How many ethnic groups live in Slovenia?</td><td>What is the count of ethnic group of Slovenia?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>46</td><td>List the seven kings of Rome.</td><td>Who has title King of Rome?</td><td>7/7=1</td><td>7/7=1</td><td>1</td></tr>
                <tr><td>47</td><td>Who were the parents of Queen Victoria?</td><td>Who are the parent of Queen Victoria?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
                <tr><td>48</td><td>Who is the heaviest player of the Chicago Bulls?</td><td>Who is the player of Chicago Bulls having the greatest weight (g)?</td><td class="wrong">0/1=0</td><td class="wrong">0/1=0</td><td class="wrong">0</td></tr>
                <tr><td>49</td><td>Which volcanos in Japan erupted since 2000?</td><td>What are the volcanos located in area Japan with eruption date greater than 1999-12-31?</td><td>8/8=1</td><td>8/8=1</td><td>1</td></tr>
                <tr><td>50</td><td>Who is the tallest basketball player?</td><td>Who is the basketball player having the greatest height (μ)?</td><td>1/1=1</td><td>1/1=1</td><td>1</td></tr>
            </table>            
        </div>
    </body>
</html>