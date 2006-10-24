require RecurseWork;



sub WorkOnFile()
{
 	my $FileName = shift @_;
 	my $UserData = shift @_;

	if ( $FileName =~ /\.html?$/ )
	{
		$FileName =~ s/^out\///;
		print "<url  href=\"http://omiscid.gforge.inria.fr/$FileName\"  />\n";
	}
}

&RecurseWork::RecurseWork('out/');