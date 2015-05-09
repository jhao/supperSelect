/*
 * Copyright 2014 Small Batch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/* SuperSelect v1.0.0 - (c) License: Apache 2.0 
 * https://github.com/jhao/supperSelect
 */
/// <reference path="../lib/jquery-1.11.3.js" />
/// <reference path="../lib/bootstrap/js/bootstrap.js" />
(function($){
	window.SuperSelect = function(selectElementContainer, options) {
		this._el = $(selectElementContainer);
		this._select = $("select", this._el);
		this._select.attr("multiple",true);
		var _options = options || {"overflowY":"auto", "height":"300px", "width":"300px"};
		this._el.css("overflow-y", _options.overflowY).css("height", _options.height ).css("width", _options.width);
		this.init();
	}	
	
	SuperSelect.prototype = {
		constructor : SuperSelect,
		init: function () {
			var listContainer = $("<ul class='panel-group main panel panel-default' style='padding:0px;'/>");
			listContainer.attr("role","tablist");
			listContainer.attr("aria-multiselectable","true");
			var listObj = [];
			var folderIdx = -1;
			var oldFolderName = "";
			
			this._select.children().each(function(element) {
				if(folderIdx === -1 && !$(this).is("optgroup"))
				{
					listObj.push({"folder":$("<optgroup label='No Group'>0</optgroup>"),"subItem":[]});
					folderIdx++ ;
				}
				if($(this).is("optgroup") && oldFolderName !== $(this).text())
				{
					listObj.push({"folder":$(this),"subItem":[]});
					oldFolderName = $(this).text();
					folderIdx++ ;
				}else{
					listObj[folderIdx].subItem.push($(this));
				}
			});
			var index = 0;
			for (index = 0; index < listObj.length; index++) {
				var folderGroup = listObj[index];
				var folder = this.createFolder(folderGroup.folder);
				var children = this.createChild(folderGroup.subItem, folderGroup.folder.html());
				if(index === 0)
				{
					children.addClass("in");
				}
				listContainer.append(folder);
				listContainer.append(children);
			}
		
			this._select.hide();
			this._el.append(listContainer);
		},
		createFolder: function (folderElement) {
			var li = $("<li class='list-group-item panel-heading'></li>").append($("<b />").append(folderElement.attr("label")));
			li.attr("data-toggle", "collapse");
			li.attr("href","#collapse" + folderElement.html());
			li.attr("aria-expanded", "true");
			li.attr("aria-controls", "collapse" + folderElement.html());
			li.attr("data-value", folderElement.val());
			return li;
		},
		createChild: function (childElements, folderValue) {
			var root = this;
			var childrenContainer = $("<ul class='panel-collapse collapse sub' style='padding:0px;'/>").attr("id","collapse" + folderValue);
			for (var index = 0; index < childElements.length; index++) {
				var element = childElements[index];
				var eachElement = $("<li class='list-group-item subItem'></li>").append(element.html()).attr("data-value",element.val());
				eachElement.on("mousedown", function (event) {
				    if (!event.ctrlKey && !event.shiftKey)
				    {
				        $("option:selected", root._select).each(function () {
				            $(this).attr("selected", false);
				        });
				        $(".active", root._el).each(function () {
				            $(this).removeClass("active");
				        })
                    
				    }
					var selectOption = $("option[value='" + $(this).attr("data-value")+"']", root._select);
					if(!$(this).hasClass("active")) {
						$(this).addClass("active");
						selectOption.attr("selected", true);
					}else{
						$(this).removeClass("active");
						selectOption.attr("selected", false);
						
					}
				});
				childrenContainer.append(eachElement);
			}
			return childrenContainer;
		}
	}
}($));
 