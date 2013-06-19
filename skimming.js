/**
 * skimming | jQuery plugin
 * Copyright (C) 2012 - 2013 Vecora AS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 * @author Erling Owe <owe@vecora.no>
 * @copyright Vecora AS, 2012 - 2013
 * @package skimming
 * @version 1.0.0
 */

(function($) {

    var defaultOptions = {
		defaultIndex: 0,
		onDefaultIndexChange: function() {},
		onIndexChange: function() {},
		useSpaceToChangeDefaultIndex: true,
		speed: 100
	};

	$.fn.skimming = function(options) {

		var opts = jQuery.extend({}, defaultOptions, options);
	
		$(this).each(function() {
	
			var container = $(this);

			var thumbWidth = container.width();
			var thumbHeight = container.height();
			
			// Alternate way of calculating the thumb size that don't require the 
			// UL element to have a preset size, but instead requires the images to
			// be loaded and thus cannot be initiated at document ready
			// var thumbWidth = container.find('img').width();
			// var thumbHeight = container.find('img').height();
			
			var defaultIndex = opts.defaultIndex;
			var currentIndex = opts.defaultIndex;
			
			var numThumbs = container.children().size();
			var zoneWidth = thumbWidth / numThumbs;

			// The UL element size needs to be set for the alternative method.
			// container.css('width', thumbWidth);
			// container.css('height', thumbHeight);

			container.css('position', 'relative');
			
			container.children().css('position', 'absolute');
			container.children().css('top', '0');
			container.children().css('left', '0');
			container.children().css('display', 'none');
			container.children().eq(opts.defaultIndex).css('display', 'block');


			function changeIndex(index, force) {

				// Don't do anything if it's the current index.
				if (container.children().eq(index).css('display') !== 'none' && !force)
					return;

				// Trigger onIndexChange and don't do anything if it returnes false.
				if (opts.onIndexChange({index: index}) === false)
					return;

				currentIndex = index;

				// Move each li (image) element one layer backwards.
				container.children().each(function() {
					$(this).css('z-index', $(this).css('z-index') - 1);
				});

				// Stop other ongoing animations and set the layers opacity to 1 to avoid wierd stuff happening
				container.children().stop().css('opacity', '1').css('filter', 'alpha(opacity=100)'); // NOTE: The filter is a fix for MSIE 6-8.

				container.children().eq(index).css('z-index', numThumbs).fadeIn(opts.speed, function() {
					$(this).siblings().hide();
				});

			}
		
			container.mousemove(function(e) {

				// Calculate the current index.
				var offset = container.offset();
				var x = e.pageX - offset.left;
				var index = Math.floor(x / zoneWidth);

				changeIndex(index);

			});
		
			// Go back to the default index when the mouse leaves.
			container.mouseleave(function() {
				changeIndex(defaultIndex, true);
			});
		
			// Set the default index when space is pressed if useSpaceToChangeDefaultIndex is set.
			if (opts.useSpaceToChangeDefaultIndex) {
				
				$(document).keypress(function(e) {
					
					if (e.keyCode == 32 || e.charCode == 32) { 
						defaultIndex = currentIndex;
						opts.onDefaultIndexChange({
							index: defaultIndex
						});
					}
					
				});
				
			}
		
		});
	
		return this;
	
	}

})(jQuery);