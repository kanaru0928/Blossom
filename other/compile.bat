@echo off
cd /d %~dp0
 
sass %~dp0 --watch -t expanded
::sass --watch -t nested sass:css
::sass --watch -t compact sass:css
::sass --watch -t compressed sass:css
