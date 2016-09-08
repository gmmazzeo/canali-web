<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="src/AutocompleteObject.js"></script>
        <script type="text/javascript" src="src/CanaliInput.js"></script>
        <link rel="stylesheet" href="styles/dialog.css" type="text/css" />
        <link rel="stylesheet" href="styles/token-input.css" type="text/css" />
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/normalize.min.css" />
        <link rel="stylesheet" href="http://yellowstone.cs.ucla.edu/wis/css/main.css" />
        <script type="text/javascript">
            $(document).ready(function () {
                new CanaliInput("inputDiv", "autocomplete", "translate", "query", "results",  "settings", 2, 200);
            });
            function toggle(i) {
                if (i===1) {
                    $("#toggle1").toggle("slide");
                    $("#toggle2").toggle("slide");
                } else {
                    $("#toggle3").toggle("slide");
                    $("#toggle4").toggle("slide");                    
                }
            }
            function openDialog(dialog_name, donttoggle) {
                var dialog = $("#" + dialog_name)
                var maskHeight = $(document).height();
                var maskWidth = $(window).width();
                var dialogTop = 100;
                var dialogLeft = (maskWidth / 2) - (dialog.width() / 2);
                $('#dialog-overlay').css({height: maskHeight, width: maskWidth}).show();
                var dialogHeigth = maskHeight - 2 * dialogTop;
                dialog.css({top: dialogTop, left: dialogLeft, height: dialogHeigth}).show();
                if (!donttoggle)
                    toggle();
            }
            function openEntityDialog(text, uri) {
                $('#alert').hide();
                $('#entityToDescribe').setEntity(text, uri);
                openDialog("describe_entity", true);
            }
            function openAlertDialog(msg) {
                var dialog = $("#alert");
                dialog.html(msg);
                openDialog("alert", true);
            }
        </script>
        <style>
            .toggle {
                width: 200px;
                height: 100px;
                position: absolute;                
                top: 0px;
                right: 0px;                
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

    <body style="margin-bottom: 200px;">    
        <div class="header-container">
            <header class="wrapper clearfix">
                <table border="0" cellspacing="20px" cellpadding="10px">
                    <tr>
                        <td><img src="http://yellowstone.cs.ucla.edu/wis/img/logo1.jpg" width="200px" alt="ScAI"> </td>
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
        <div style="margin-top:50px; font-size:14px; line-height: 16px; position:relative;">
            <div id="inputDiv">Input div</div>
            <div style="margin: 0 auto; width:800px; font-size: 0.8em; text-align: right">Currently using <% out.print(System.getProperty("kb.name"));%></div>
            <div id="toggle1" class="toggle"><img src="open-settings.png" onclick="toggle(1)" width="50px" align="right" title="Open settings"/></div>
            <div id="toggle2" class="toggle" style="display: none; width: 300px">
                <div style="float: left; height: 200px"><img src="close-settings.png" onclick="toggle(1)" width="50px" title="Close settings"/></div>
                <div id="settings" style="width: 250px; height: 200px; border: 1px; border-color: #8496ba; margin-left: 60px">
                </div>
            </div>
        </div>
        <div style="margin-top:100px; font-size:14px; line-height: 16px; position:relative;">
            <div id="toggle3" class="toggle"><img src="open-settings.png" onclick="toggle(2)" width="50px" align="right" title="Open settings"/></div>
            <div id="toggle4" class="toggle" style="display: none; width: 300px">
                <div style="float: left; height: 200px"><img src="close-settings.png" onclick="toggle(2)" width="50px" title="Close settings"/></div>
                <div id="settings" style="width: 250px; height: 200px; border: 1px; border-color: #8496ba; margin-left: 60px">
                    <a href="javascript:void(0);" onclick='openDialog("describe_entity")'>Describe entity</a><br />
                    <br />
                    <a href="javascript:void(0);" onclick='openDialog("describe_property")'>Describe property</a><br />
                </div>
            </div>
        </div>
        <div style="margin-left: auto; margin-right: auto; margin-top: 100px; font-size: 14px; line-height: 16px" id="results"></div>
        <div id="dialog-overlay"></div>
        <div id="describe_entity" class="dialog-box">
            Select an entity <input id="entityToDescribe" />
            <br />
            <div id="entity_describe_results"></div>
        </div>
        <div id="describe_property" class="dialog-box">
            Select a property <input id="propertyToDescribe" />
            <br />
            <div id="property_describe_results"> </div>
        </div>
        <div id="alert" class="dialog-box">
            This is an alert!
        </div>        
    </body>
</html>

