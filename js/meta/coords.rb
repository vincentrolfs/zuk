puts "Type?"
type = gets.chomp

puts "Coords?"

coordx = gets.chomp.to_i*16 +8
coordy = gets.chomp.to_i*16

if type == "i"

	coordy += 8

	puts '{ x: ' + coordx.to_s + ', y: ' + coordy.to_s + ', nr: 1 }'

else

	puts '[' + coordx.to_s + ', ' + coordy.to_s + ']'
	
end