# viewport-inspector
A tool to add into web projects that allows users to conveniently resize your website and assess mobile responsiveness.

The website to be resized is to be placed into an iframe (see main_website.html) as this allows original media queries of the resized website to apply.

This tool acts as a wrapper interface that displays your resizable website and houses the resizing functionality.

![me](https://github.com/Daisyliu6/Daisyliu6/blob/master/first.gif)

# Integration into your static web project

1. Insert the contents of this repository (the 5 files excluding readme.md & GIF) into your project directory at the same level as the main entrypoint to your website project (e.g. index.html). 
2. Your resizable website goes into the iframe inside the following HTML document:
   `
   main_website.html
   `
   </br>
2.1.
   `
   resizable_content.html
   ` 
   is an example HTML document that acts as the resizable website. Assuming the Viewport Inspector is in the same level of directory as the main entrypoint to your website, the `src` attribute of the iframe should just be `(entrypoint-name).html`.
   </br>
   </br>
   Note: The Viewport Inspector (called toolbar in the HTML) is already included in the HTML document.
   </br>
   Note: The Viewport Inspector's CSS and JS are already linked to the HTML document `main_website.html`.
